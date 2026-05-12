'use client';

import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Do not show the WhatsApp button on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a 
      href="https://wa.me/917300305018" 
      className="wa-float-btn" 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label="Chat on WhatsApp"
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
}
