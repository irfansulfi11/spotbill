'use client';

import { useRef } from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import { getIcon } from '@/lib/icons';
import { useReveal, revealDelay } from '@/lib/reveal';
import { perfectFor } from '@/lib/content';

export default function PerfectFor() {
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
            <Eyebrow>{perfectFor.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1)} className="t-h2 mt-5 text-sb-navy">
            {perfectFor.heading}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:mt-16 lg:grid-cols-5">
          {perfectFor.items.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <li
                key={item.title}
                data-reveal
                style={revealDelay(index, 55)}
                className="group rounded-2xl border border-sb-line bg-white p-5 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-sb-blue hover:shadow-[0_18px_40px_-28px_rgba(10,23,57,0.45)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sb-blue/10 text-sb-blue transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6">
                  <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[0.95rem] font-semibold leading-tight text-sb-navy">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.8rem] leading-snug text-sb-navy/65">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>

        <p
          data-reveal
          className="t-body mt-10 max-w-3xl border-l-2 border-sb-blue pl-5 text-sb-navy/70 lg:mt-14"
        >
          {perfectFor.closing}
        </p>
      </div>
    </section>
  );
}
