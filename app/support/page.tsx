import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Button from '@/components/ui/Button';
import { support } from '@/lib/content';
import { jsonLd, pageMetadata, subPageSchema } from '@/lib/seo';
import { site, whatsappLink } from '@/lib/site';

export const metadata = pageMetadata(
  'Support',
  'Installation, thermal printer setup and product help for SpotBill — from our Kerala team. Call, WhatsApp or email us.',
  '/support',
);

const channels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Fastest way to reach us',
    href: whatsappLink('Hi, I need help with SpotBill.'),
    external: true,
  },
  {
    icon: Phone,
    label: 'Call',
    value: site.phone,
    href: site.phoneHref,
    external: false,
  },
  {
    icon: Mail,
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
];

export default function SupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(subPageSchema('Support', '/support')),
        }}
      />
      <PageShell eyebrow="Help" title={support.title} intro={support.sub}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="t-h3 text-sb-navy">{support.heading}</h2>

            <ul className="mt-8 flex flex-col gap-3">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-sb-line bg-white p-4 transition-[transform,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-sb-blue"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sb-blue/10 text-sb-blue transition-transform duration-500 group-hover:rotate-6">
                      <channel.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-semibold text-sb-navy">
                        {channel.label}
                      </span>
                      <span className="block break-all text-[0.85rem] text-sb-navy/65">
                        {channel.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-sb-line bg-sb-cloud p-5">
              <h3 className="t-mono-sm text-sb-navy/70">
                {support.hoursHeading}
              </h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {support.hours.map((line) => (
                  <li key={line} className="text-[0.9rem] text-sb-navy/70">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-[0.85rem] text-sb-navy/65">
                <MapPin className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
                {site.location} · All Kerala service
              </p>
            </div>
          </div>

          <div>
            <h2 className="t-h3 text-sb-navy">{support.printerHeading}</h2>
            <ol className="mt-8 flex flex-col gap-5">
              {support.printerSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="t-mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sb-line bg-white text-[0.75rem] text-sb-blue">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="pt-1.5 text-[0.95rem] leading-relaxed text-sb-navy/65">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Button href={whatsappLink('Hi, I need help pairing my thermal printer with SpotBill.')}>
                Get printer help on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}
