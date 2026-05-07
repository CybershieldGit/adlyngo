'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

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
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'bi-grid-1x2' },
    { label: 'Manage Reels', path: '/admin/dashboard/reels', icon: 'bi-film' },
    { label: 'Manage Projects', path: '/admin/dashboard/projects', icon: 'bi-briefcase' },
    { label: 'Manage Blogs', path: '/admin/dashboard/blogs', icon: 'bi-journal-text' },
    { label: 'Categories', path: '/admin/dashboard/categories', icon: 'bi-tags' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="bg-dark text-white p-4" style={{ width: '280px' }}>
        <div className="mb-5">
          <h4 className="fw-600 mb-0">Adlyngo CMS</h4>
        </div>
        
        <ul className="nav flex-column gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li className="nav-item" key={item.path}>
                <Link 
                  href={item.path} 
                  className={`nav-link d-flex align-items-center rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-white-50 hover-bg-dark-gray'}`}
                >
                  <i className={`bi ${item.icon} me-3 fs-5`}></i>
                  <span className="fw-500">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-5">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-5 bg-very-light-gray overflow-auto">
        {children}
      </main>
    </div>
  );
}
