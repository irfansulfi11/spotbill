'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import Eyebrow from '@/components/ui/Eyebrow';
import PhoneFrame from '@/components/phone/PhoneFrame';
import Screen from '@/components/phone/screens';
import LazyScreen from '@/components/phone/LazyScreen';
import { gsap, EASE } from '@/lib/gsap';
import { prefersReducedMotion, revealDelay, useReveal } from '@/lib/reveal';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { features } from '@/lib/content';

/**
 * The centrepiece.
 *
 * Desktop (>=1024px): the phone holds position while each module scrolls
 * past on the left, and its screen swaps as the active module changes.
 * The hold is `position: sticky` — no pin, no measurement, no re-layout on
 * a URL-bar resize, and it cannot fall out of sync with Lenis because the
 * browser is doing it.
 *
 * Below 1024px: stacked cards, each with its own live screen. Reduced
 * motion gets the stacked layout at any width.
 *
 * Scrub-snap is deliberately absent at every width — it hijacks the wheel
 * and argues with the smoothed scroll.
 */
export default function FeatureModules() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <section
      id="features"
      data-band="dark"
      /* No `overflow-hidden` here: it would break the sticky column. */
      className="relative bg-sb-navy py-20 sm:py-28 lg:py-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_35%,rgba(11,99,246,0.16),transparent_65%)]"
      />
      {isDesktop && !reduced ? <StickyModules /> : <StackedModules />}
    </section>
  );
}

/* ------------------------------------------------------------- desktop */

function StickyModules() {
  const root = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const blocks = Array.from(el.querySelectorAll<HTMLElement>('[data-module]'));

    // A detection line across the middle of the viewport: whichever module
    // is crossing it is the one the phone should be showing.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = blocks.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  // Crossfade the screen whenever the active module changes.
  useEffect(() => {
    if (!phone.current || prefersReducedMotion()) return;
    const target = phone.current.querySelector('[data-screen-swap]');
    if (!target) return;
    gsap.fromTo(
      target,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: EASE.in },
    );
  }, [active]);

  return (
    <div ref={root} className="sb-shell relative grid grid-cols-2 gap-16">
      <div>
        <div className="flex min-h-[70vh] flex-col justify-center py-24">
          <div data-reveal style={revealDelay(0)}>
            <Eyebrow tone="dark">{features.eyebrow}</Eyebrow>
          </div>
          <h2
            data-reveal
            style={revealDelay(1)}
            className="t-h2 mt-5 max-w-lg text-white"
          >
            {features.heading}
          </h2>
          <p
            data-reveal
            style={revealDelay(2)}
            className="t-body mt-5 max-w-md text-white/65"
          >
            {features.sub}
          </p>
        </div>

        {features.modules.map((module) => (
          <article
            key={module.id}
            id={module.id}
            data-module
            className="flex min-h-screen scroll-mt-24 flex-col justify-center py-24"
          >
            <p
              data-reveal
              style={revealDelay(0, 70)}
              className="t-mono text-[2.5rem] font-medium leading-none text-white/15"
            >
              {module.index}
            </p>
            <h3
              data-reveal
              style={revealDelay(1, 70)}
              className="t-h2 mt-4 max-w-lg text-[clamp(1.8rem,2.6vw,2.6rem)] text-white"
            >
              {module.title}
            </h3>
            <p
              data-reveal
              style={revealDelay(2, 70)}
              className="t-body mt-4 max-w-md text-white/65"
            >
              {module.body}
            </p>
            <div
              data-reveal
              style={revealDelay(3, 70)}
              className="sb-rule mt-8 max-w-md"
              data-dark
            />
            <ul
              data-reveal
              style={revealDelay(4, 70)}
              className="mt-6 grid max-w-md grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2"
            >
              {module.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-[0.9rem] text-white/70"
                >
                  <Check
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-sb-blue-bright"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        ref={phone}
        className="sticky top-0 flex h-screen items-center justify-center self-start"
      >
        <div className="w-[16.5rem]">
          <PhoneFrame>
            <div data-screen-swap className="h-full">
              <LazyScreen>
                <Screen name={features.modules[active].screen} />
              </LazyScreen>
            </div>
          </PhoneFrame>
          <p className="t-mono-sm mt-6 text-center text-[0.62rem] text-white/55">
            {features.modules[active].index} / 06 ·{' '}
            {features.modules[active].title}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- mobile */

function StackedModules() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="sb-shell relative">
      <div data-reveal style={revealDelay(0)}>
        <Eyebrow tone="dark">{features.eyebrow}</Eyebrow>
      </div>
      <h2 data-reveal style={revealDelay(1)} className="t-h2 mt-5 text-white">
        {features.heading}
      </h2>
      <p data-reveal style={revealDelay(2)} className="t-body mt-4 text-white/65">
        {features.sub}
      </p>

      <div className="mt-12 flex flex-col gap-5">
        {features.modules.map((module) => (
          <article
            key={module.id}
            id={module.id}
            data-module
            className="sb-card-dark scroll-mt-24 rounded-3xl border border-sb-line-dark bg-white/[0.025] p-5 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p
                  data-reveal
                  style={revealDelay(0, 60)}
                  className="t-mono text-[1.6rem] font-medium leading-none text-white/12"
                >
                  {module.index}
                </p>
                <h3 data-reveal style={revealDelay(1, 60)} className="t-h3 mt-3 text-white">
                  {module.title}
                </h3>
                <p
                  data-reveal
                  style={revealDelay(2, 60)}
                  className="mt-2.5 text-[0.95rem] leading-relaxed text-white/65"
                >
                  {module.body}
                </p>
              </div>

              <div
                data-reveal
                style={revealDelay(2, 60)}
                className="w-[7.5rem] shrink-0 sm:w-[9rem]"
              >
                <PhoneFrame glow={false}>
                  <LazyScreen>
                    <Screen name={module.screen} />
                  </LazyScreen>
                </PhoneFrame>
              </div>
            </div>

            <div
              data-reveal
              style={revealDelay(3, 60)}
              className="sb-rule mt-6"
              data-dark
            />

            <ul
              data-reveal
              style={revealDelay(4, 60)}
              className="mt-5 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2"
            >
              {module.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-[0.875rem] text-white/70"
                >
                  <Check
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-sb-blue-bright"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
