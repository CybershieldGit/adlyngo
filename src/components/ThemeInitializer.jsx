'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ThemeInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure DOM is ready after route change
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.REINIT_THEME) {
        console.log('Re-initializing theme for:', pathname);
        window.REINIT_THEME();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
