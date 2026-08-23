'use client';

import { useCallback, useRef, useState } from 'react';
import { Check, Printer as PrinterIcon } from 'lucide-react';
import Eyebrow from '@/components/ui/Eyebrow';
import Receipt from '@/components/phone/Receipt';
import { gsap, EASE } from '@/lib/gsap';
import {
  prefersReducedMotion,
  revealDelay,
  useEnterOnce,
  useReveal,
} from '@/lib/reveal';
import { printer } from '@/lib/content';

/**
 * The receipt returns — this time the print is button-driven and the bill is
 * the full itemised one, GST split and UPI QR included.
 */
export default function Printer() {
  const root = useRef<HTMLElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const [printing, setPrinting] = useState(false);

  const print = useCallback(() => {
    const el = paper.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: 'inset(0 0 0% 0)' });
      return;
    }

    setPrinting(true);
    gsap
      .timeline({ onComplete: () => setPrinting(false) })
      .set(el, { clipPath: 'inset(0 0 100% 0)' })
      .set(el.querySelectorAll('[data-receipt-line]'), { opacity: 0 })
      .to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: EASE.receipt })
      .to(
        el.querySelectorAll('[data-receipt-line]'),
        { opacity: 1, duration: 0.3, stagger: 0.05, ease: 'none' },
        0.1,
      );
  }, []);

  useReveal(root);
  useEnterOnce(root, print, { rootMargin: '0px 0px -30% 0px' });

  return (
    <section
      ref={root}
      data-band="light"
      className="bg-sb-cloud py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div data-reveal style={revealDelay(0, 85)}>
            <Eyebrow>{printer.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1, 85)} className="t-h2 mt-5 max-w-xl text-sb-navy">
            {printer.heading}
          </h2>
          <p data-reveal style={revealDelay(2, 85)} className="t-body mt-5 max-w-xl text-sb-navy/70">
            {printer.body}
          </p>

          <ul data-reveal style={revealDelay(3, 85)} className="mt-8 flex flex-col gap-3">
            {printer.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[0.95rem] text-sb-navy/70"
              >
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-sb-blue"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>

          <button
            data-reveal style={revealDelay(4, 85)}
            type="button"
            onClick={print}
            disabled={printing}
            className="sb-gradient group mt-9 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(11,99,246,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 disabled:opacity-70"
          >
            <PrinterIcon
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            {printer.cta}
          </button>
        </div>

        {/* the printer head the paper feeds out of */}
        <div data-reveal style={revealDelay(5, 85)} className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[19rem]">
            <div className="relative z-10 rounded-2xl border border-sb-line bg-sb-navy px-5 pb-4 pt-5 shadow-[0_20px_50px_-30px_rgba(10,23,57,0.7)]">
              <div className="flex items-center justify-between">
                <span className="t-mono-sm text-[0.55rem] text-white/60">
                  Thermal 80mm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sb-mint" />
                  <span className="t-mono-sm text-[0.55rem] text-white/60">
                    Ready
                  </span>
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-black/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
            </div>

            <div ref={paper} className="relative -mt-1 flex justify-center">
              <Receipt variant="full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
