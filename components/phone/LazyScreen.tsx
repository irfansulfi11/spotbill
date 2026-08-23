'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/lib/useInView';

/**
 * Defers a phone screen's DOM until it is nearly on screen.
 *
 * Eight live screens rendered up front is roughly a third of this page's
 * nodes, and on a mid-range Android that shows up directly in style/layout
 * time and hydration cost. PhoneFrame has already reserved the box, so
 * nothing shifts when a screen arrives.
 *
 * Never use this for the hero — that screen is above the fold.
 */
export default function LazyScreen({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>('300px');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  return (
    <div ref={ref} className="h-full">
      {mounted ? children : null}
    </div>
  );
}
