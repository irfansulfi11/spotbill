'use client';

import { useEffect, useRef } from 'react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';
import { formatINR } from '@/lib/utils';

const { reports } = screens;
const peak = Math.max(...reports.bars.map((b) => b.value));

/** Three bars grow from zero while the day's total counts up beside them. */
export default function ScreenReports() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const totalRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const state = { value: 0 };
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.4 })
        .from('[data-report-bar]', {
          scaleY: 0,
          duration: 0.85,
          stagger: 0.13,
          ease: 'power3.out',
          transformOrigin: 'bottom center',
        })
        .to(
          state,
          {
            value: reports.total,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              if (totalRef.current) {
                totalRef.current.textContent = formatINR(state.value);
              }
            },
          },
          0,
        )
        .from(
          '[data-report-row]',
          { x: 12, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
          '-=0.5',
        )
        .set(state, { value: 0 }, '+=2');
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell title={reports.title} subtitle={reports.dateLabel}>
        <div className="rounded-2xl bg-sb-navy p-3">
          <p className="t-mono-sm text-[0.52rem] text-white/60">
            {reports.totalLabel}
          </p>
          <p
            ref={totalRef}
            className="t-mono mt-1 text-[1.4rem] font-medium leading-none text-white"
          >
            {formatINR(reports.total)}
          </p>

          <div className="mt-3 flex h-16 items-end gap-2">
            {reports.bars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-12 w-full items-end">
                  <span
                    data-report-bar
                    className="sb-gradient block w-full rounded-t-md"
                    style={{ height: `${(bar.value / peak) * 100}%` }}
                  />
                </div>
                <span className="t-mono text-[0.45rem] text-white/65">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-2 flex flex-col gap-1.5">
          {reports.rows.map((row) => (
            <li
              key={row.label}
              data-report-row
              className="flex items-center justify-between rounded-xl border border-sb-line bg-white px-2.5 py-2"
            >
              <span className="text-[0.64rem] font-medium text-sb-navy/70">
                {row.label}
              </span>
              <span className="t-mono text-[0.68rem] font-medium text-sb-navy">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </ScreenShell>
    </div>
  );
}
