'use client';

import { useEffect, useRef } from 'react';
import { ScanBarcode, Search, TriangleAlert } from 'lucide-react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';

const { inventory } = screens;
const lowItem = inventory.items.find((i) => i.low);

/** The low-stock row pulses amber while its count ticks down. */
export default function ScreenInventory() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const stockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || !ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const state = { value: lowItem?.stock ?? 6 };
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.4 })
        .from('[data-inv-row]', {
          x: -14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.09,
          ease: 'power3.out',
        })
        .to(
          '[data-inv-low]',
          {
            backgroundColor: 'rgba(245,158,11,0.16)',
            borderColor: 'rgba(245,158,11,0.55)',
            duration: 0.7,
            repeat: 3,
            yoyo: true,
            ease: 'power2.inOut',
          },
          '+=0.2',
        )
        .to(
          state,
          {
            value: 2,
            duration: 2.4,
            ease: 'none',
            snap: { value: 1 },
            onUpdate: () => {
              if (stockRef.current) {
                stockRef.current.textContent = String(Math.round(state.value));
              }
            },
          },
          '<',
        )
        .set(state, { value: lowItem?.stock ?? 6 }, '+=1.2')
        .call(() => {
          if (stockRef.current) {
            stockRef.current.textContent = String(lowItem?.stock ?? 6);
          }
        });
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell
        title={inventory.title}
        subtitle={`${inventory.items.length} products · 1 low`}
      >
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-sb-line bg-white px-2.5 py-2">
          <Search className="h-3 w-3 shrink-0 text-sb-navy/50" aria-hidden="true" />
          <span className="flex-1 truncate text-[0.62rem] text-sb-navy/50">
            {inventory.searchPlaceholder}
          </span>
          <ScanBarcode className="h-3.5 w-3.5 shrink-0 text-sb-blue" aria-hidden="true" />
        </div>

        <ul className="flex flex-col gap-1.5">
          {inventory.items.map((item) => (
            <li
              key={item.sku}
              data-inv-row
              {...(item.low ? { 'data-inv-low': '' } : {})}
              className={
                item.low
                  ? 'flex items-center gap-2 rounded-xl border border-sb-amber/40 bg-sb-amber/10 px-2.5 py-2'
                  : 'flex items-center gap-2 rounded-xl border border-sb-line bg-white px-2.5 py-2'
              }
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.68rem] font-semibold leading-tight text-sb-navy">
                  {item.name}
                </p>
                <p className="t-mono text-[0.52rem] leading-tight text-sb-navy/65">
                  {item.sku}
                </p>
              </div>

              {item.low ? (
                <span className="flex items-center gap-1 rounded-md bg-sb-amber/20 px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wide text-[#9A6200]">
                  <TriangleAlert className="h-2.5 w-2.5" aria-hidden="true" />
                  {inventory.lowLabel}
                </span>
              ) : null}

              <span className="t-mono w-12 text-right text-[0.66rem] font-medium text-sb-navy">
                {item.low ? (
                  <span ref={stockRef}>{item.stock}</span>
                ) : (
                  item.stock
                )}
                <span className="ml-0.5 text-[0.45rem] text-sb-navy/65">pc</span>
              </span>
            </li>
          ))}
        </ul>
      </ScreenShell>
    </div>
  );
}
