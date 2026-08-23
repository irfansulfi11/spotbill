'use client';

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import PlayBadge from '@/components/ui/PlayBadge';
import PhoneFrame from '@/components/phone/PhoneFrame';
import ScreenBilling from '@/components/phone/ScreenBilling';
import Receipt from '@/components/phone/Receipt';
import { gsap, EASE } from '@/lib/gsap';
import { clamp, onScrollFrame, prefersReducedMotion } from '@/lib/reveal';
import { hero } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

/**
 * The hero owns the page-load sequence (~1.4s, skippable) and the
 * scroll-scrubbed receipt print. The LCP element is the h1 text — nothing
 * heavier is allowed above the fold.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    let cleanup: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: EASE.in } });

        // 1. The nav mark draws itself in. The two stroked paths of the mark
        //    carry the drawing; the bolt and the speed lines land after.
        const strokes = gsap.utils.toArray<SVGPathElement>(
          'header [data-logo-s], header [data-logo-d]',
        );
        strokes.forEach((path) => {
          const length = path.getTotalLength?.() ?? 0;
          if (!length) return;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });

        tl.to(strokes, {
          strokeDashoffset: 0,
          duration: 0.4,
          stagger: 0.06,
        })
          .from(
            'header [data-logo-bolt], header [data-logo-speed]',
            { scale: 0.4, opacity: 0, duration: 0.4, transformOrigin: 'center' },
            '-=0.15',
          )

          // 2. Headline lines mask-reveal upward with a 4px blur resolving.
          .from(
            '[data-hero-line]',
            {
              yPercent: 115,
              opacity: 0,
              filter: 'blur(4px)',
              duration: 0.9,
              stagger: 0.08,
            },
            '-=0.2',
          )

          // 3. Sub + CTAs.
          .from(
            '[data-hero-fade]',
            { y: 20, opacity: 0, duration: 0.6, stagger: 0.06 },
            '-=0.5',
          )

          // 4. The phone rises, then its screen content plays on its own.
          .from(
            '[data-hero-phone]',
            { y: 60, scale: 0.96, opacity: 0, duration: 0.9 },
            '-=0.65',
          )
          .from(
            '[data-hero-ribbon]',
            { x: -24, opacity: 0, duration: 0.5 },
            '-=0.45',
          )

          // 5. Trust strip and the marquee band close the sequence.
          .from(
            '[data-hero-trust] > *',
            { y: 12, opacity: 0, duration: 0.45, stagger: 0.05 },
            '-=0.4',
          )
          .from('[data-hero-after]', { opacity: 0, duration: 0.4 }, '-=0.3');

        // Skippable: any intent to move on fast-forwards the sequence.
        const skip = () => tl.progress(1);
        window.addEventListener('wheel', skip, { once: true, passive: true });
        window.addEventListener('touchstart', skip, { once: true, passive: true });
        window.addEventListener('keydown', skip, { once: true });

        // The launch ribbon keeps a slow float once it has landed.
        gsap.to('[data-hero-ribbon]', {
          y: -6,
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.6,
        });
      }

      // The signature move: the receipt prints out from under the phone,
      // scrubbed against the hero's own scroll.
      //
      // ScrollTrigger used to own this. It is now one subscriber on the
      // shared rAF loop: a single getBoundingClientRect per frame, and only
      // while the hero is actually on screen.
      if (!prefersReducedMotion()) {
        const section = root.current!;
        const receipt = section.querySelector<HTMLElement>('[data-hero-receipt]');

        if (receipt) {
          const lines = Array.from(
            receipt.querySelectorAll<HTMLElement>('[data-receipt-line]'),
          );
          receipt.style.clipPath = 'inset(0 0 100% 0)';
          lines.forEach((line) => {
            line.style.opacity = '0';
          });

          let visible = true;
          const observer = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
            },
            { rootMargin: '200px' },
          );
          observer.observe(section);

          const stop = onScrollFrame(() => {
            if (!visible) return;

            const rect = section.getBoundingClientRect();
            const travel = rect.height - window.innerHeight * 0.3;
            const p = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;

            // expo.out, so the paper leaves the slot quickly then settles
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            receipt.style.clipPath = `inset(0 0 ${(1 - eased) * 100}% 0)`;

            // Lines type on one after another as the paper clears them.
            lines.forEach((line, index) => {
              line.style.opacity = String(
                clamp(eased * (lines.length + 3) - index, 0, 1),
              );
            });
          });

          cleanup = () => {
            observer.disconnect();
            stop();
          };
        }
      }
    }, root);

    return () => {
      cleanup?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      data-band="dark"
      className="relative overflow-hidden bg-sb-ink pb-16 pt-28 sm:pb-40 lg:pb-52 lg:pt-40"
    >
      {/* one gradient wash, no meshes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_10%,rgba(11,99,246,0.28),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-sb-navy"
      />

      <div className="sb-shell relative grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
        <div>
          <div data-hero-fade>
            <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>
          </div>

          <h1 className="t-h1 mt-6 text-white">
            {hero.headline.map((line) => (
              <span key={line.text} className="sb-mask">
                <span
                  data-hero-line
                  /* The forward lean is reserved for the two accent words —
                     leaning the whole headline reads as italic, not as brand. */
                  className={line.accent ? 't-lean inline-block' : 'inline-block'}
                  style={
                    line.accent
                      ? { color: 'var(--color-sb-blue-bright)' }
                      : undefined
                  }
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-fade
            className="t-body mt-7 max-w-xl text-white/65"
          >
            {hero.sub}
          </p>

          <div
            data-hero-fade
            className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <PlayBadge height={56} />
            <Button href={whatsappLink()} variant="outline">
              {hero.ctaSecondary}
            </Button>
          </div>

          <ul
            data-hero-trust
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5"
          >
            {hero.trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-[0.8rem] text-white/65"
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-sb-blue-bright"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div data-hero-phone className="relative w-[15.5rem] sm:w-[17rem]">
            {site.offerActive ? (
              <div
                data-hero-ribbon
                className="absolute left-1 -top-12 z-20 -rotate-[7deg] sm:-left-44 sm:top-20 rounded-xl border border-sb-blue-bright/40 bg-sb-navy/95 px-3.5 py-3 shadow-[0_18px_40px_-20px_rgba(5,9,26,0.9)] backdrop-blur-sm"
              >
                <p className="t-mono-sm text-[0.55rem] text-sb-amber">
                  {hero.offerRibbon.kicker}
                </p>
                <p className="t-mono mt-1 text-[1.35rem] font-medium leading-none text-white">
                  {hero.offerRibbon.amount}
                </p>
                <p className="t-mono-sm mt-1 text-[0.52rem] text-white/65">
                  {hero.offerRibbon.note}
                </p>
              </div>
            ) : null}

            <PhoneFrame>
              <ScreenBilling />
            </PhoneFrame>

            {/* prints out from under the phone's bottom edge */}
            <div
              data-hero-receipt
              className="absolute left-1/2 top-[80%] -z-10 hidden origin-top -translate-x-1/2 scale-[0.82] sm:block"
            >
              <Receipt variant="short" />
            </div>
          </div>
        </div>
      </div>

      <div data-hero-after aria-hidden="true" />
    </section>
  );
}
