export const metadata = {
  title: 'Adlyngo Admin',
  description: 'Adlyngo Content Management System',
  robots: 'noindex, nofollow', // Prevent search engines from indexing the admin panel
};

export default function AdminRootLayout({ children }) {
  // We use a separate layout for the admin area to avoid the public Navbar/Footer
  return (
    <div className="admin-layout bg-light" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
