'use client';

import { useCallback, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * A card with a 1.5deg pointer tilt that springs back on leave.
 * Mouse only, and skipped entirely under reduced motion.
 */
export default function Card({
  children,
  className,
  tone = 'light',
  tilt = true,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
  tilt?: boolean;
  as?: 'div' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !tilt || event.pointerType !== 'mouse') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: px * 3,
        rotateX: -py * 3,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 900,
      });
    },
    [tilt],
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
    });
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPointerMove={onMove as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPointerLeave={onLeave as any}
      className={cn(
        'relative rounded-2xl border',
        tone === 'dark'
          ? 'sb-card-dark border-sb-line-dark bg-white/[0.025]'
          : 'border-sb-line bg-white transition-colors duration-300',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
