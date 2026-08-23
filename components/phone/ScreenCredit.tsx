'use client';

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';
import { formatAmount, formatINR } from '@/lib/utils';

const { credit } = screens;

/** The udhaar balance strips to zero and a mint "Paid" tick lands. */
export default function ScreenCredit() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const balanceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!inView || !ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const state = { value: credit.balance };
      const write = () => {
        if (balanceRef.current) {
          balanceRef.current.textContent = formatINR(state.value);
        }
      };

      gsap
        .timeline({ repeat: -1, repeatDelay: 1.8 })
        .from('[data-credit-row]', {
          y: 12,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power3.out',
        })
        .to(state, {
          value: 0,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: write,
        })
        .to('[data-credit-card]', { backgroundColor: '#0d3d28', duration: 0.4 }, '<0.6')
        .from(
          '[data-credit-paid]',
          { scale: 0.4, opacity: 0, duration: 0.5, ease: 'back.out(2.2)' },
          '-=0.2',
        )
        .to('[data-credit-paid]', { opacity: 0, duration: 0.4 }, '+=1.6')
        .to('[data-credit-card]', { backgroundColor: '#0A1739', duration: 0.4 }, '<')
        .to(state, {
          value: credit.balance,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: write,
        });
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell title={credit.title} subtitle={credit.phone}>
        <div
          data-credit-card
          className="relative overflow-hidden rounded-2xl bg-sb-navy p-3.5"
        >
          <p className="t-mono-sm text-[0.52rem] text-white/60">
            {credit.balanceLabel}
          </p>
          <p
            ref={balanceRef}
            className="t-mono mt-1 text-[1.5rem] font-medium leading-none text-white"
          >
            {formatINR(credit.balance)}
          </p>
          <p className="mt-1.5 text-[0.62rem] font-semibold text-white/70">
            {credit.name}
          </p>

          <span
            data-credit-paid
            className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sb-mint px-2 py-1 text-[0.55rem] font-bold uppercase tracking-wide text-white"
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden="true" />
            {credit.paidLabel}
          </span>
        </div>

        <span className="sb-gradient mt-2 flex items-center justify-center rounded-xl py-2 text-[0.62rem] font-semibold text-white">
          {credit.collectLabel}
        </span>

        <ul className="mt-2 flex flex-col gap-1.5">
          {credit.history.map((row) => (
            <li
              key={row.label}
              data-credit-row
              className="flex items-center gap-2 rounded-xl border border-sb-line bg-white px-2.5 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.66rem] font-semibold leading-tight text-sb-navy">
                  {row.label}
                </p>
                <p className="t-mono text-[0.52rem] leading-tight text-sb-navy/65">
                  {row.date}
                </p>
              </div>
              <span
                className={
                  row.amount > 0
                    ? 't-mono text-[0.66rem] font-medium text-sb-mint'
                    : 't-mono text-[0.66rem] font-medium text-sb-navy'
                }
              >
                {row.amount > 0 ? '+' : '−'}
                {formatAmount(Math.abs(row.amount), false)}
              </span>
            </li>
          ))}
        </ul>
      </ScreenShell>
    </div>
  );
}
