'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import Rupees from './Rupees';
import { gsap, EASE } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/reveal';
import { cn } from '@/lib/utils';

type Item = { q: string; a: string };

/**
 * One panel open at a time. Height is tweened by GSAP rather than by a CSS
 * max-height guess, so a long answer opens at the same speed as a short one.
 */
export default function Accordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      const isOpen = index === open;

      if (prefersReducedMotion()) {
        gsap.set(panel, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 });
        return;
      }

      gsap.to(panel, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.45,
        ease: EASE.state,
        overwrite: true,
      });
    });
  }, [open]);

  return (
    <div className="divide-y divide-sb-line border-y border-sb-line">
      {items.map((item, index) => {
        const isOpen = index === open;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    'text-[1.02rem] font-semibold leading-snug transition-colors duration-300 sm:text-[1.1rem]',
                    isOpen ? 'text-sb-blue' : 'text-sb-navy group-hover:text-sb-blue',
                  )}
                >
                  <Rupees>{item.q}</Rupees>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isOpen
                      ? 'rotate-45 border-sb-blue bg-sb-blue text-white'
                      : 'border-sb-line text-sb-navy/50 group-hover:border-sb-blue group-hover:text-sb-blue',
                  )}
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              ref={(el) => {
                panels.current[index] = el;
              }}
              className="overflow-hidden"
              style={{ height: index === 0 ? 'auto' : 0, opacity: index === 0 ? 1 : 0 }}
            >
              <p className="max-w-2xl pb-6 pr-10 text-[0.95rem] leading-relaxed text-sb-navy/70">
                <Rupees>{item.a}</Rupees>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
