'use client';

import { useEffect } from 'react';

/** Locks body scroll while the mobile drawer is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('lenis-stopped');
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, [locked]);
}
