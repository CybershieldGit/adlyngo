'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/admin/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'bi-grid-fill' },
    { label: 'Manage Reels', path: '/admin/dashboard/reels', icon: 'bi-film' },
    { label: 'Manage Projects', path: '/admin/dashboard/projects', icon: 'bi-briefcase-fill' },
    { label: 'Manage Blogs', path: '/admin/dashboard/blogs', icon: 'bi-journal-text' },
    { label: 'Categories', path: '/admin/dashboard/categories', icon: 'bi-tags-fill' },
  ];

  return (
    <div className="d-flex w-100" style={{ minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="d-lg-none position-fixed top-0 start-0 end-0 bg-admin-primary text-white px-3 py-2 d-flex align-items-center justify-content-between shadow-sm" style={{ zIndex: 1001, height: '60px' }}>
        <div className="d-flex align-items-center overflow-hidden">
          <img src="/images/logo_w.svg" alt="Adlyngo" height="24" className="me-2 flex-shrink-0" style={{ maxWidth: '120px', objectFit: 'contain' }} />
          <span className="fw-600 fs-6 text-white border-start border-white-10 ps-2 ms-1 text-nowrap">
            CMS
          </span>
        </div>
        <button
          className="btn btn-link text-white p-0 fs-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar text-white p-1 d-flex flex-column ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mb-5 d-none d-lg-block">
          <Link href="/admin/dashboard" className="text-decoration-none d-flex align-items-center">
            <img src="/images/logo_w.svg" alt="Adlyngo" height="30" className="me-2 flex-shrink-0" style={{ maxWidth: '140px', objectFit: 'contain' }} />
          </Link>
        </div>

        <ul className="nav flex-column gap-2 mt-4 mt-lg-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li className="nav-item" key={item.path}>
                <Link
                  href={item.path}
                  className={`nav-link d-flex align-items-center rounded px-3 py-3 ${isActive ? 'bg-admin-primary text-white shadow' : 'text-white-50 hover-bg-dark-gray'}`}
                  style={{ transition: 'all 0.25s ease' }}
                >
                  <i className={`bi ${item.icon} me-3 fs-4 ${isActive ? 'text-white' : 'text-admin-primary'}`}></i>
                  <span className="fw-500 text-nowrap">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-4 border-top border-white-10">
          <button
            onClick={handleLogout}
            className="btn btn-link text-white-50 text-decoration-none w-100 d-flex align-items-center justify-content-center hover-text-white"
            style={{ transition: 'all 0.2s ease' }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main p-1 p-lg-5 overflow-auto">
        <div className="container-fluid py-2">
          {children}
        </div>
      </main>
    </div>
  );
}
