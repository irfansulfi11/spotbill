'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Scroll-driven behaviour without ScrollTrigger.
 *
 * ScrollTrigger was ~25KB gzipped and a single ~440ms evaluation task under
 * a 4x CPU throttle. Everything it did on this site is covered here by
 * IntersectionObserver, CSS transitions and one shared rAF scroll loop.
 * GSAP core stays for the hero timeline, the receipt print and the idle
 * screen loops — the things that are genuinely timeline-shaped.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------- reveals */

/**
 * Reveals every `[data-reveal]` inside `root` as it enters the viewport.
 *
 * The hidden state and the transition live in CSS (`app/globals.css`), so
 * no JavaScript runs per frame and reduced motion is handled by a media
 * query rather than by a branch. Elements are unobserved once shown —
 * nothing on this page replays on the way back up.
 *
 * Stagger comes from `--reveal-delay`, set inline by the caller.
 */
export function useReveal(
  root: RefObject<HTMLElement | null>,
  { threshold = 0.12, rootMargin = '0px 0px -12% 0px' } = {},
) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!targets.length) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [root, threshold, rootMargin]);
}

/** Inline style for a staggered reveal: `style={revealDelay(index)}`. */
export function revealDelay(index: number, step = 80): React.CSSProperties {
  return { ['--reveal-delay' as string]: `${index * step}ms` };
}

/* ------------------------------------------------------- one-shot enter */

/**
 * Fires `onEnter` once, the first time `ref` is far enough into view.
 * Used for the counters, the offline demo and the printer's auto-print.
 */
export function useEnterOnce(
  ref: RefObject<HTMLElement | null>,
  onEnter: () => void,
  { rootMargin = '0px 0px -25% 0px' } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    let done = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (done || !entries[0].isIntersecting) return;
        done = true;
        observer.disconnect();
        onEnter();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, onEnter, rootMargin]);
}

/* --------------------------------------------------- shared scroll loop */

type ScrollFn = (state: { y: number; velocity: number }) => void;

const subscribers = new Set<ScrollFn>();
let running = false;
let lastY = 0;
let frame = 0;

function tick() {
  const y = window.scrollY;
  const velocity = y - lastY;
  lastY = y;

  subscribers.forEach((fn) => fn({ y, velocity }));

  if (subscribers.size) frame = requestAnimationFrame(tick);
  else running = false;
}

/**
 * One rAF loop for every scroll-position reader on the page — the receipt
 * scrub, the marquee's velocity skew and the final CTA's parallax all read
 * from it, so there is exactly one layout read per frame.
 */
export function onScrollFrame(fn: ScrollFn): () => void {
  subscribers.add(fn);
  if (!running) {
    running = true;
    lastY = window.scrollY;
    frame = requestAnimationFrame(tick);
  }
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size && running) {
      cancelAnimationFrame(frame);
      running = false;
    }
  };
}

/**
 * Progress of `el` through the viewport, 0 → 1, using the same mental model
 * as ScrollTrigger's `start` / `end`: fractions of the viewport height at
 * which the element's top enters and its bottom leaves.
 */
export function elementProgress(el: Element, startVh = 0, endVh = 0.7): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = vh * startVh;
  const end = vh * endVh;
  const total = rect.height + start - end;
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (start - rect.top) / total));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
