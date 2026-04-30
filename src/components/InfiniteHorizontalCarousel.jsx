'use client';

import { useState, useMemo, useRef, useCallback } from 'react';

const DEMO_REELS = [
  { id: 1, category: 'Ads', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, category: 'UGC', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, category: 'Branding', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, category: 'Ads', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, category: 'UGC', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, category: 'Branding', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const TABS = ['All', 'Ads', 'UGC', 'Branding'];

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
  const [activeTab, setActiveTab] = useState('All');
  const [activeIdx, setActiveIdx] = useState(null);
  const [mutedMap, setMutedMap] = useState({});
  const videoRefs = useRef({});

  const loopData = useMemo(() => {
    const filtered = activeTab === 'All' 
      ? DEMO_REELS 
      : DEMO_REELS.filter(item => item.category === activeTab);
    
    let dataToLoop = filtered.length > 0 ? filtered : DEMO_REELS;
    
    // Ensure enough items for smooth infinite scroll
    while (dataToLoop.length < 8) {
      dataToLoop = [...dataToLoop, ...dataToLoop];
    }
    
    return [...dataToLoop, ...dataToLoop];
  }, [activeTab]);

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

  return (
    <div className="ihc-section">
      {/* Tabs */}
      <div className="ihc-tabs">
        {TABS.map((tab) => (
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
                key={`${item.id}-${idx}`}
                className={`ihc-reel ${isActive ? 'ihc-reel--active' : ''}`}
                onClick={() => handleReelClick(idx)}
                onMouseEnter={() => handleReelInteraction(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
              >
                <video
                  ref={el => { videoRefs.current[idx] = el; }}
                  src={item.src}
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
                  <span className="ihc-reel__label">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
