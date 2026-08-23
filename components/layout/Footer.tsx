import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import PlayBadge from '@/components/ui/PlayBadge';
import { footer } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sb-ink text-white">
      <div className="sb-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <Logo tone="dark" withTagline href={null} />
          <PlayBadge height={48} />
        </div>

        <nav aria-label="Product">
          <h2 className="t-mono-sm mb-5 text-white/65">
            {footer.productHeading}
          </h2>
          <ul className="flex flex-col gap-3">
            {footer.productLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.95rem] text-white/70 transition-colors hover:text-sb-blue-bright"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="t-mono-sm mb-5 text-white/65">
            {footer.supportHeading}
          </h2>
          <ul className="flex flex-col gap-3 text-[0.95rem] text-white/70">
            <li>
              <a
                href={site.phoneHref}
                className="flex items-center gap-2.5 transition-colors hover:text-sb-blue-bright"
              >
                <Phone className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-sb-blue-bright"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 break-all transition-colors hover:text-sb-blue-bright"
              >
                <Mail className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-sb-blue" aria-hidden="true" />
              {site.location}
            </li>
            <li>
              <Link
                href="/support"
                className="text-sb-blue-bright transition-colors hover:text-white"
              >
                Support centre →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="t-mono-sm mb-5 text-white/65">
            {footer.poweredHeading}
          </h2>
          <a
            href={site.parentSite}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-sb-line-dark p-5 transition-colors hover:border-sb-blue"
          >
            <p className="font-display text-base font-bold uppercase leading-tight tracking-tight text-white">
              {site.parentBrand}
            </p>
            <p className="mt-2 text-sm italic text-white/65">
              {site.parentTagline}
            </p>
            <p className="t-mono-sm mt-4 text-sb-blue-bright transition-transform duration-300 group-hover:translate-x-1">
              myitworld.in →
            </p>
          </a>
        </div>
      </div>

      <div className="border-t border-sb-line-dark">
        <div className="sb-shell flex flex-col gap-3 py-6 text-[0.8rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand} · {site.parentBrand} · {footer.serviceLine}
          </p>
          <ul className="flex items-center gap-5">
            {footer.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
