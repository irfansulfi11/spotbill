'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Keeps idle loops off the main thread when a phone screen is scrolled away.
 * Six looping timelines running at once is exactly the kind of thing that
 * shows up as jank on a mid-range Android.
 */
export function useInView<T extends HTMLElement>(rootMargin = '120px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
