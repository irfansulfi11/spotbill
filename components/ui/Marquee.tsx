'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { clamp, onScrollFrame } from '@/lib/reveal';
import { cn } from '@/lib/utils';

/**
 * GSAP-driven rather than a CSS keyframe, because the speed has to respond
 * to scroll velocity — the track accelerates and skews up to 4deg when you
 * flick down the page, then eases back to its resting pace.
 *
 * Velocity comes from the shared rAF loop in `lib/reveal.ts`. Pauses on
 * hover and when off screen, and never runs under reduced motion.
 */
export default function Marquee({
  items,
  className,
  itemClassName,
  speed = 26,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  /** Seconds for one full pass of the track. */
  speed?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;

    const loop = gsap.to(track, {
      xPercent: -50,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    let hovered = false;
    let visible = false;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !hovered) loop.play();
      else loop.pause();
    });
    observer.observe(el);

    let skew = 0;
    const stop = onScrollFrame(({ velocity }) => {
      if (!visible) return;
      const boost = clamp(1 + Math.abs(velocity) / 22, 1, 5);
      loop.timeScale(boost);
      // Ease the skew towards its target rather than tweening per frame.
      // It has to go through gsap.set, not style.transform — the loop owns
      // this element's transform and a raw write would fight it.
      const target = clamp(velocity / 5, -4, 4);
      skew += (target - skew) * 0.12;
      gsap.set(track, { skewX: skew });
    });

    const enter = () => {
      hovered = true;
      loop.pause();
    };
    const leave = () => {
      hovered = false;
      if (visible) loop.play();
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);

    return () => {
      observer.disconnect();
      stop();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      loop.kill();
    };
  }, [speed]);

  // The track is duplicated so the -50% translate loops seamlessly. The
  // second copy is hidden from assistive tech.
  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? 'true' : undefined}
    >
      {items.map((item) => (
        <li
          key={item}
          className={cn('flex shrink-0 items-center gap-6 px-6', itemClassName)}
        >
          <span>{item}</span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className={cn('overflow-hidden', className)}>
      <div data-marquee-track className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
