'use client';

import { useState, useEffect } from 'react';

/**
 * Detects a mobile viewport below `breakpoint` (default 768px).
 *
 * Returns `false` on the first (server) render and corrects on mount to avoid
 * a hydration mismatch.
 */
export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};
