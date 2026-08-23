import { Mail, MessageCircle, Phone } from 'lucide-react';
import { legal } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

type Section = { h: string; p: readonly string[] };

export default function LegalBody({ sections }: { sections: readonly Section[] }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
      <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
        <p className="t-mono-sm text-sb-navy/65">On this page</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {sections.map((section) => (
            <li key={section.h}>
              <a
                href={`#${slug(section.h)}`}
                className="text-[0.9rem] text-sb-navy/70 transition-colors hover:text-sb-blue"
              >
                {section.h}
              </a>
            </li>
          ))}
        </ul>
        <p className="t-mono-sm mt-8 text-[0.62rem] text-sb-navy/65">
          {legal.effectiveLabel}: {legal.effectiveDate}
        </p>
      </nav>

      <div className="max-w-2xl">
        {sections.map((section) => (
          <section key={section.h} id={slug(section.h)} className="scroll-mt-28">
            <div className="sb-rule mb-6 mt-10 first:mt-0" />
            <h2 className="t-h3 text-sb-navy">{section.h}</h2>
            {section.p.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-4 text-[0.98rem] leading-relaxed text-sb-navy/65"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="sb-rule mb-6 mt-10" />
        <h2 className="t-h3 text-sb-navy">{legal.contactHeading}</h2>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-sb-navy/65">
          {legal.contactBody}
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          <li>
            <a
              href={site.phoneHref}
              className="flex items-center gap-2.5 text-[0.95rem] text-sb-navy transition-colors hover:text-sb-blue"
            >
              <Phone className="h-4 w-4 text-sb-blue" aria-hidden="true" />
              {site.phone}
            </a>
          </li>
          <li>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[0.95rem] text-sb-navy transition-colors hover:text-sb-blue"
            >
              <MessageCircle className="h-4 w-4 text-sb-blue" aria-hidden="true" />
              WhatsApp
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2.5 break-all text-[0.95rem] text-sb-navy transition-colors hover:text-sb-blue"
            >
              <Mail className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
              {site.email}
            </a>
          </li>
        </ul>
        <p className="mt-6 text-[0.85rem] text-sb-navy/70">
          {site.parentBrand} · {site.location}
        </p>
      </div>
    </div>
  );
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
