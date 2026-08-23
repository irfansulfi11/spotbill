'use client';

import { useEffect, useRef } from 'react';
import { Minus, Plus, QrCode } from 'lucide-react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';
import { formatAmount, formatINR } from '@/lib/utils';

const { billing } = screens;
const subtotal = billing.items.reduce((sum, i) => sum + i.qty * i.rate, 0);
const tax = subtotal * billing.taxRate;
const total = subtotal + tax;

/** Line items add in, the total counts up, then the UPI QR offers itself. */
export default function ScreenBilling() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (prefersReducedMotion()) {
      if (totalRef.current) {
        totalRef.current.textContent = formatINR(total, true);
      }
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.6 });

      tl.from('[data-bill-row]', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.13,
        ease: 'power3.out',
      })
        .to(
          counter,
          {
            value: total,
            duration: 1.15,
            ease: 'power2.out',
            onUpdate: () => {
              if (totalRef.current) {
                totalRef.current.textContent = formatINR(counter.value, true);
              }
            },
          },
          0.25,
        )
        .from(
          '[data-bill-qr]',
          { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' },
          '-=0.35',
        )
        .from(
          '[data-bill-pay]',
          { y: 12, opacity: 0, duration: 0.45, ease: 'power3.out' },
          '-=0.3',
        )
        .set(counter, { value: 0 }, '+=2.2');
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell
        title={billing.title}
        subtitle={`${screens.invoiceNo} · ${billing.customer}`}
        footer={
          <div className="rounded-2xl bg-sb-navy p-3">
            <div className="flex items-center justify-between text-[0.6rem] text-white/65">
              <span>{billing.subtotalLabel}</span>
              <span className="t-mono">{formatAmount(subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[0.6rem] text-white/65">
              <span>{billing.taxLabel}</span>
              <span className="t-mono">{formatAmount(tax)}</span>
            </div>
            <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-2">
              <span className="t-mono-sm text-[0.55rem] text-white/60">
                {billing.totalLabel}
              </span>
              <span
                ref={totalRef}
                className="t-mono text-[1.15rem] font-medium leading-none text-white"
              >
                {formatINR(total, true)}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span
                data-bill-qr
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1.5 text-[0.55rem] font-medium text-white"
              >
                <QrCode className="h-3 w-3" aria-hidden="true" />
                {billing.upiLabel}
              </span>
              <span
                data-bill-pay
                className="sb-gradient flex flex-1 items-center justify-center rounded-lg py-2 text-[0.62rem] font-semibold text-white"
              >
                {billing.payLabel}{' '}
                <span className="t-mono ml-1">{formatINR(total, true)}</span>
              </span>
            </div>
          </div>
        }
      >
        <ul className="flex flex-col gap-1.5">
          {billing.items.map((item) => (
            <li
              key={item.name}
              data-bill-row
              className="flex items-center gap-2 rounded-xl border border-sb-line bg-white px-2.5 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.68rem] font-semibold leading-tight text-sb-navy">
                  {item.name}
                </p>
                <p className="t-mono text-[0.55rem] leading-tight text-sb-navy/70">
                  {formatAmount(item.rate)} × {item.qty}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex items-center gap-1 rounded-md bg-sb-cloud px-1 py-0.5"
              >
                <Minus className="h-2 w-2 text-sb-navy/65" />
                <span className="t-mono w-3 text-center text-[0.58rem] text-sb-navy">
                  {item.qty}
                </span>
                <Plus className="h-2 w-2 text-sb-blue" />
              </span>
              <span className="t-mono w-11 text-right text-[0.66rem] font-medium text-sb-navy">
                {formatAmount(item.qty * item.rate)}
              </span>
            </li>
          ))}
        </ul>
      </ScreenShell>
    </div>
  );
}
