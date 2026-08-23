'use client';

import Image from 'next/image';
import { useRef } from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import PlayBadge from '@/components/ui/PlayBadge';
import { useReveal, revealDelay } from '@/lib/reveal';
import { download } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * The QR is generated into /public/qr.svg at build time by
 * scripts/generate-assets.mjs — never fetched from a QR API at runtime.
 */
export default function Download() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section
      ref={root}
      data-band="dark"
      className="bg-sb-navy py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div data-reveal style={revealDelay(0, 90)}>
            <Eyebrow tone="dark">{download.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1, 90)} className="t-h2 mt-5 max-w-lg text-white">
            {download.heading}
          </h2>
          <div data-reveal style={revealDelay(2, 90)} className="mt-8">
            <PlayBadge height={60} />
          </div>
          <p data-reveal style={revealDelay(3, 90)} className="mt-6 text-[0.9rem] text-white/60">
            {download.note}
          </p>
        </div>

        <div data-reveal style={revealDelay(4, 90)} className="flex justify-center lg:justify-end">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-sb-line-dark bg-white/[0.03] p-7 sm:p-9">
            <div className="rounded-2xl bg-white p-4">
              <Image
                src="/qr.svg"
                alt={`QR code linking to the SpotBill listing on Google Play (${site.playStoreAppId})`}
                width={168}
                height={168}
                className="h-[9.5rem] w-[9.5rem] sm:h-[10.5rem] sm:w-[10.5rem]"
              />
            </div>
            <p className="t-mono-sm max-w-[12rem] text-center text-[0.62rem] leading-relaxed text-white/65">
              {download.scanLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
