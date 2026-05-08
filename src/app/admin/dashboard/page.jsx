'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        
        // Credentials must be included to send the HttpOnly JWT cookie
        const response = await fetch(`${apiUrl}/auth/me`, {
          credentials: 'include', 
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setAdmin(data.data.admin);
        } else {
          // If unauthorized (401), kick to login
          router.push('/admin/login');
        }
      } catch (err) {
        console.error("Failed to authenticate", err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="fw-700 text-dark-gray mb-4">Welcome back, {admin?.name || 'Admin'}!</h2>
      
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 box-shadow-small border-radius-10px p-4 bg-white h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-admin-primary bg-opacity-10 text-admin-primary rounded-circle p-3 me-3">
                <i className="bi bi-film fs-4"></i>
              </div>
              <h5 className="mb-0 fw-600">Reels</h5>
            </div>
            <p className="text-muted mb-0">Manage the carousel videos on the homepage. Reorder them or upload new featured reels.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 box-shadow-small border-radius-10px p-4 bg-white h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                <i className="bi bi-briefcase fs-4"></i>
              </div>
              <h5 className="mb-0 fw-600">Projects</h5>
            </div>
            <p className="text-muted mb-0">Update your agency portfolio. Add case studies, upload galleries, and highlight technologies.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 box-shadow-small border-radius-10px p-4 bg-white h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 me-3">
                <i className="bi bi-journal-text fs-4"></i>
              </div>
              <h5 className="mb-0 fw-600">Blogs</h5>
            </div>
            <p className="text-muted mb-0">Publish SEO-optimized articles and insights. Manage tags, categories, and cover images.</p>
          </div>
        </div>
      </div>

      <div className="card border-0 box-shadow-small border-radius-10px p-5 bg-white text-center">
        <i className="bi bi-shield-check text-success fs-1 mb-3 d-block"></i>
        <h4 className="fw-600">System Status: Optimal</h4>
        <p className="text-muted mb-0">Your session is secure. Select an option from the sidebar to start managing content.</p>
      </div>
    </div>
  );
}
