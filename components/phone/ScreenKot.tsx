'use client';

import { useEffect } from 'react';
import { Printer } from 'lucide-react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';

const { kot } = screens;

/** An order card slides from the floor column across to the kitchen column. */
export default function ScreenKot() {
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView || !ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const card = ref.current!.querySelector<HTMLElement>('[data-kot-move]');
      const target = ref.current!.querySelector<HTMLElement>('[data-kot-slot]');
      if (!card || !target) return;

      const travel = () =>
        target.getBoundingClientRect().left - card.getBoundingClientRect().left;

      gsap
        .timeline({ repeat: -1, repeatDelay: 1.5 })
        .from('[data-kot-card]', {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power3.out',
        })
        .to(card, {
          x: travel,
          duration: 0.75,
          ease: 'power2.inOut',
          delay: 0.5,
        })
        .from(
          '[data-kot-sent]',
          { scale: 0.5, opacity: 0, duration: 0.45, ease: 'back.out(2)' },
          '-=0.25',
        )
        .to('[data-kot-sent]', { opacity: 0, duration: 0.35 }, '+=1.4')
        .to(card, { x: 0, duration: 0.5, ease: 'power2.inOut' }, '<');
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell title={kot.title} subtitle="3 open tables">
        <div className="grid h-full grid-cols-2 gap-2">
          {kot.columns.map((column, columnIndex) => (
            <div key={column} className="flex min-w-0 flex-col gap-1.5">
              <p className="t-mono-sm text-[0.5rem] text-sb-navy/65">{column}</p>

              {columnIndex === 0 ? (
                kot.orders.map((order, orderIndex) => (
                  <div
                    key={order.table}
                    data-kot-card
                    {...(orderIndex === 0 ? { 'data-kot-move': '' } : {})}
                    className="relative z-10 rounded-xl border border-sb-line bg-white px-2 py-2"
                  >
                    <p className="truncate text-[0.64rem] font-bold leading-tight text-sb-navy">
                      {order.table}
                    </p>
                    <p className="mt-0.5 truncate text-[0.52rem] leading-tight text-sb-navy/60">
                      {order.note}
                    </p>
                    <p className="t-mono mt-1 text-[0.5rem] text-sb-blue">
                      {order.items} items
                    </p>
                  </div>
                ))
              ) : (
                <div
                  data-kot-slot
                  className="relative flex-1 rounded-xl border border-dashed border-sb-line bg-sb-cloud/60"
                >
                  <span
                    data-kot-sent
                    className="absolute inset-x-1.5 top-1.5 flex items-center justify-center gap-1 rounded-lg bg-sb-mint px-1.5 py-1 text-[0.48rem] font-bold uppercase tracking-wide text-white"
                  >
                    <Printer className="h-2.5 w-2.5" aria-hidden="true" />
                    {kot.kotLabel}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScreenShell>
    </div>
  );
}
