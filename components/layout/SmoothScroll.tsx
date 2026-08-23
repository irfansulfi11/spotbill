'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from '@/lib/gsap';

/**
 * Lenis smooth scrolling.
 *
 * Nothing needs to be told about Lenis's position any more: the reveals use
 * IntersectionObserver (which reports real geometry regardless of how the
 * scroll is driven) and the scrub readers in `lib/reveal.ts` read
 * `getBoundingClientRect` on their own rAF loop.
 *
 * Under `prefers-reduced-motion` Lenis is never instantiated at all — native
 * scrolling is left completely alone.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links have to go through Lenis or they fight the smoothed
    // scroll. Nav links are written as `/#section` so they also work from
    // the sub-routes, so match on the hash and only intercept when the
    // target actually exists on this page.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      const hash = href.slice(href.indexOf('#'));
      if (hash.length < 2) return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
