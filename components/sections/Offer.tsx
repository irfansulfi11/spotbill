'use client';

import { useRef } from 'react';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Counter from '@/components/ui/Counter';
import Eyebrow from '@/components/ui/Eyebrow';
import { useReveal, revealDelay } from '@/lib/reveal';
import { offer } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

/**
 * Rendered only while `site.offerActive` is true.
 *
 * Deliberately the plainest section on the page: one number, one button.
 * Restraint sells harder than motion here.
 */
export default function Offer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  if (!site.offerActive) return null;

  return (
    <section
      ref={root}
      id="pricing"
      data-band="dark"
      className="scroll-mt-24 bg-sb-navy py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell flex flex-col items-center text-center">
        <div data-reveal style={revealDelay(0, 90)}>
          <Eyebrow tone="dark">{offer.eyebrow}</Eyebrow>
        </div>

        <p
          data-reveal style={revealDelay(1, 90)}
          className="t-mono mt-8 text-[clamp(3.5rem,10vw,7rem)] font-medium leading-none text-white"
        >
          <Counter to={site.launchOfferAmount} />
          <span className="t-mono text-white/65">/-</span>
        </p>

        <h2
          data-reveal style={revealDelay(2, 90)}
          className="t-h3 mt-5 uppercase tracking-tight text-white/80"
        >
          Lifetime License
        </h2>

        <p
          data-reveal style={revealDelay(3, 90)}
          className="t-body mt-6 max-w-lg text-white/60"
        >
          {offer.body}
        </p>

        <ul
          data-reveal style={revealDelay(4, 90)}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2.5"
        >
          {offer.includes.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[0.9rem] text-white/60"
            >
              <Check
                className="h-4 w-4 shrink-0 text-sb-blue-bright"
                strokeWidth={3}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>

        <div data-reveal style={revealDelay(5, 90)} className="mt-10">
          <Button href={whatsappLink(`Hi, I'd like to claim the ${site.launchOffer} for SpotBill.`)}>
            {offer.cta}
          </Button>
        </div>

        <p
          data-reveal style={revealDelay(6, 90)}
          className="t-mono-sm mt-7 max-w-md text-[0.62rem] leading-relaxed text-white/65"
        >
          {offer.note}
        </p>
      </div>
    </section>
  );
}
