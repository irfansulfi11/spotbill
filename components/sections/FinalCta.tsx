'use client';

import { useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';
import LogoMark from '@/components/ui/LogoMark';
import PlayBadge from '@/components/ui/PlayBadge';
import {
  clamp,
  onScrollFrame,
  prefersReducedMotion,
  revealDelay,
  useReveal,
} from '@/lib/reveal';
import { finalCta } from '@/lib/content';
import { site } from '@/lib/site';

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  useReveal(root);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = root.current;
    const el = mark.current;
    if (!section || !el) return;

    // The one parallax on the page, and it stays under 0.2. Driven by the
    // shared rAF loop, and skipped entirely while the section is off screen.
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '100px' },
    );
    observer.observe(section);

    const stop = onScrollFrame(() => {
      if (!visible) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
        0,
        1,
      );
      el.style.transform = `translate3d(0, ${(progress - 0.5) * -15}%, 0)`;
    });

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  return (
    <section
      ref={root}
      data-band="dark"
      className="sb-vh relative flex items-center overflow-hidden bg-sb-ink py-24"
    >
      {/* the mark, huge and cropped by the viewport edge */}
      <div
        aria-hidden="true"
        ref={mark}
        className="pointer-events-none absolute -right-[18%] top-1/2 -translate-y-1/2 opacity-[0.08] will-change-transform"
      >
        <LogoMark variant="mono" className="h-[42rem] w-[42rem] text-white" />
      </div>

      <div className="sb-shell relative">
        <h2 data-reveal style={revealDelay(0)} className="t-h2 max-w-3xl text-white">
          {finalCta.heading}
        </h2>
        <p
          data-reveal
          style={revealDelay(1)}
          className="t-body mt-6 max-w-xl text-white/65"
        >
          {finalCta.body}
        </p>

        <div
          data-reveal
          style={revealDelay(2)}
          className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          <PlayBadge height={58} />
          <a
            href={site.phoneHref}
            className="group inline-flex items-center gap-2.5 text-[1rem] font-semibold text-white transition-colors hover:text-sb-blue-bright"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-sb-line-dark transition-colors group-hover:border-sb-blue-bright">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </span>
            {finalCta.callLabel} {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
