'use client';

import { useRef } from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import { getIcon } from '@/lib/icons';
import { useReveal, revealDelay } from '@/lib/reveal';
import { why } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Bento layout. Column spans are declared rather than derived so the grid
 * resolves to four clean rows at every breakpoint instead of relying on
 * auto-flow to guess.
 */
const SPANS = [2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1];

/**
 * Reveal order: `row + col / 2` for each cell, which reads as a diagonal
 * wave running down and to the right rather than a flat top-to-bottom run.
 */
const WAVE = [0, 1, 1, 2, 2.5, 2, 3, 3.5, 3, 3.5, 4, 4.5];

export default function WhyGrid() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section
      ref={root}
      data-band="light"
      className="bg-sb-cloud py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell">
        <div className="max-w-3xl">
          <div data-reveal style={revealDelay(0)}>
            <Eyebrow>{why.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1)} className="t-h2 mt-5 text-sb-navy">
            {why.heading}
          </h2>
          <p data-reveal style={revealDelay(2)} className="t-body mt-5 text-sb-navy/70">
            {why.sub}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">
          {why.items.map((item, index) => {
            const Icon = getIcon(item.icon);
            const span = SPANS[index] ?? 1;
            const feature = item.size === 'lg';

            return (
              <li
                key={item.title}
                data-reveal
                style={{ ['--reveal-delay' as string]: `${(WAVE[index] ?? 0) * 90}ms` }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-sb-line bg-white p-5 transition-colors duration-300 hover:border-sb-blue/45 sm:p-6',
                  span === 2 ? 'col-span-2' : 'col-span-1',
                  feature && 'lg:p-8',
                )}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sb-blue/[0.07] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span
                  className={cn(
                    'relative flex items-center justify-center rounded-xl bg-sb-blue/10 text-sb-blue transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5',
                    feature ? 'h-12 w-12' : 'h-10 w-10',
                  )}
                >
                  <Icon
                    className={feature ? 'h-6 w-6' : 'h-5 w-5'}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <h3
                  className={cn(
                    'relative mt-4 font-semibold leading-tight text-sb-navy',
                    feature ? 'text-lg sm:text-xl' : 'text-[0.95rem]',
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    'relative mt-1.5 leading-snug text-sb-navy/65',
                    feature ? 'text-[0.95rem]' : 'text-[0.82rem]',
                  )}
                >
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
