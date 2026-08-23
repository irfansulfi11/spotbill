'use client';

import { useRef } from 'react';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import { useReveal, revealDelay } from '@/lib/reveal';
import { faq } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

/**
 * The same array feeds the FAQPage JSON-LD in lib/seo.ts, so the rich
 * result and the page can never drift apart.
 */
export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const items = site.offerActive ? [...faq.items, faq.offerItem] : faq.items;
  useReveal(root);

  return (
    <section
      ref={root}
      id="faq"
      data-band="light"
      className="scroll-mt-24 bg-white py-20 sm:py-28 lg:py-32"
    >
      <div className="sb-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal style={revealDelay(0, 90)}>
            <Eyebrow>{faq.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1, 90)} className="t-h2 mt-5 text-sb-navy">
            {faq.heading}
          </h2>
          <p data-reveal style={revealDelay(2, 90)} className="t-body mt-5 max-w-sm text-sb-navy/70">
            Still not sure? Message us and a real person in Kerala will answer.
          </p>
          <div data-reveal style={revealDelay(3, 90)} className="mt-7">
            <Button href={whatsappLink()} variant="ghost">
              Ask on WhatsApp
            </Button>
          </div>
        </div>

        <div data-reveal style={revealDelay(4, 90)}>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
