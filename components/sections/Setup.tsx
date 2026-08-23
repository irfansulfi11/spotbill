'use client';

import { useRef } from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import { useReveal, revealDelay } from '@/lib/reveal';
import { setup } from '@/lib/content';

/**
 * The only numbered section on the page, because this genuinely is a
 * sequence. The connector draws left to right as the row enters, and each
 * numeral scales up behind an expanding blue ring.
 *
 * All three effects are CSS transitions/animations gated on the `is-in`
 * class that `useReveal` adds — no per-frame JavaScript.
 */
export default function Setup() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section
      ref={root}
      data-band="light"
      className="bg-white py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell">
        <div className="max-w-3xl">
          <div data-reveal style={revealDelay(0)}>
            <Eyebrow>{setup.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1)} className="t-h2 mt-5 text-sb-navy">
            {setup.heading}
          </h2>
          <p data-reveal style={revealDelay(2)} className="t-body mt-4 text-sb-navy/70">
            {setup.sub}
          </p>
        </div>

        <div className="relative mt-14 lg:mt-20">
          <svg
            aria-hidden="true"
            className="absolute left-0 top-7 hidden h-px w-full lg:block"
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
          >
            <path
              data-reveal="fade"
              pathLength="1"
              className="sb-draw"
              d="M0 0.5 L1000 0.5"
              stroke="var(--color-sb-blue)"
              strokeWidth="1"
              opacity="0.5"
              fill="none"
            />
          </svg>

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {setup.steps.map((step, index) => (
              <li key={step.num} className="relative">
                <span className="relative flex h-14 w-14 items-center justify-center">
                  <span
                    data-reveal="fade"
                    style={revealDelay(index, 140)}
                    aria-hidden="true"
                    className="sb-ring absolute inset-0 rounded-full border border-sb-blue"
                  />
                  <span
                    data-reveal="scale"
                    style={revealDelay(index, 140)}
                    className="t-mono flex h-14 w-14 items-center justify-center rounded-full border border-sb-line bg-white text-[1.05rem] font-medium text-sb-blue"
                  >
                    {step.num}
                  </span>
                </span>

                <div data-reveal style={revealDelay(index, 120)}>
                  <h3 className="t-h3 mt-6 text-sb-navy">{step.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-sb-navy/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
