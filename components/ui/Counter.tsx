'use client';

import { useCallback, useRef } from 'react';
import { countUp } from '@/lib/gsap';
import { prefersReducedMotion, useEnterOnce } from '@/lib/reveal';
import { cn, formatINR } from '@/lib/utils';

/**
 * Counts a rupee figure up the first time it is scrolled to, then holds.
 * Formatting always goes through the Indian grouping formatter — ₹5,000,
 * never ₹5.000.
 */
export default function Counter({
  to,
  className,
  suffix,
}: {
  to: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const start = useCallback(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    countUp(node, to, (n) => formatINR(n), { duration: 1.2 });
  }, [to]);

  useEnterOnce(ref, start, { rootMargin: '0px 0px -15% 0px' });

  return (
    <span className={cn('t-mono tabular-nums', className)}>
      <span ref={ref}>{formatINR(to)}</span>
      {suffix}
    </span>
  );
}
