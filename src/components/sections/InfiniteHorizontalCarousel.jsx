'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';

/* Inline SVG icons to avoid extra dependencies */
function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export default function InfiniteHorizontalCarousel() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [activeIdx, setActiveIdx] = useState(null);
  const [mutedMap, setMutedMap] = useState({});
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';
        const response = await fetch(`${apiUrl}/reels?published=true`);
        if (!response.ok) throw new Error('Failed to fetch reels');
        const data = await response.json();
        
        // Ensure we handle the structure from our ApiResponse class
        if (data.success && data.data) {
          const reelsArray = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.data.reels)
              ? data.data.reels
              : [];
          setReels(reelsArray);
        } else {
          setReels([]);
        }
      } catch (error) {
        console.error("Error fetching reels:", error);
        // Fallback for demo purposes if backend isn't running yet
        setReels([
          { _id: '1', category: { name: 'Ads' }, reelUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { _id: '2', category: { name: 'UGC' }, reelUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { _id: '3', category: { name: 'Branding' }, reelUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  // Dynamically generate tabs based on fetched reels
  const tabs = useMemo(() => {
    const uniqueCategories = [...new Set(reels.map(item => item.category?.name).filter(Boolean))];
    return ['All', ...uniqueCategories];
  }, [reels]);

  const loopData = useMemo(() => {
    if (!reels || reels.length === 0) return [];
    
    const filtered = activeTab === 'All' 
      ? reels 
      : reels.filter(item => item.category?.name === activeTab);
    
    let dataToLoop = filtered.length > 0 ? filtered : reels;
    
    // Ensure enough items for smooth infinite scroll
    while (dataToLoop.length > 0 && dataToLoop.length < 8) {
      dataToLoop = [...dataToLoop, ...dataToLoop];
    }
    
    return dataToLoop.length > 0 ? [...dataToLoop, ...dataToLoop] : [];
  }, [activeTab, reels]);

  const toggleMute = useCallback((e, idx) => {
    e.stopPropagation(); // Separate mute click from reel click
    const video = videoRefs.current[idx];
    if (video) {
      const newMuted = !video.muted;
      video.muted = newMuted;
      setMutedMap(prev => ({ ...prev, [idx]: newMuted }));
    }
  }, []);

  const handleReelInteraction = useCallback((idx) => {
    // If a different reel is active, mute it first
    if (activeIdx !== null && activeIdx !== idx && videoRefs.current[activeIdx]) {
      videoRefs.current[activeIdx].muted = true;
      setMutedMap(prev => ({ ...prev, [activeIdx]: true }));
    }
    setActiveIdx(idx);
  }, [activeIdx]);

  const handleReelClick = useCallback((idx) => {
    // On mobile, tap to toggle active state
    if (activeIdx === idx) {
      // Tap again to deactivate and resume scroll
      setActiveIdx(null);
      const video = videoRefs.current[idx];
      if (video) {
        video.muted = true;
        setMutedMap(prev => ({ ...prev, [idx]: true }));
      }
    } else {
      handleReelInteraction(idx);
    }
  }, [activeIdx, handleReelInteraction]);

  const handleMouseLeave = useCallback((idx) => {
    // Mute video when mouse leaves (desktop)
    const video = videoRefs.current[idx];
    if (video) {
      video.muted = true;
      setMutedMap(prev => ({ ...prev, [idx]: true }));
    }
    setActiveIdx(null);
  }, []);

  if (loading) {
    return (
      <div className="ihc-section d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-white" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (reels.length === 0) return null;

  return (
    <div className="ihc-section">
      {/* Tabs */}
      <div className="ihc-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`ihc-tab ${activeTab === tab ? 'ihc-tab--active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="ihc-carousel">
        <div className={`ihc-track ${activeIdx !== null ? 'ihc-track--paused' : ''}`} key={activeTab}>
          {loopData.map((item, idx) => {
            const isMuted = mutedMap[idx] !== false; // default muted
            const isActive = activeIdx === idx;

            return (
              <div
                key={`${item._id}-${idx}`}
                className={`ihc-reel ${isActive ? 'ihc-reel--active' : ''}`}
                onClick={() => handleReelClick(idx)}
                onMouseEnter={() => handleReelInteraction(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
              >
                <video
                  ref={el => { videoRefs.current[idx] = el; }}
                  src={item.reelUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />

                {/* Mute/Unmute button — only visible on active reel */}
                <button
                  className={`ihc-mute-btn ${isActive ? 'ihc-mute-btn--visible' : ''}`}
                  onClick={(e) => toggleMute(e, idx)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                </button>

                <div className="ihc-reel__overlay">
                  <span className="ihc-reel__label">{item.category?.name || 'Reel'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
