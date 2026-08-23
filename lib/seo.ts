import type { Metadata } from 'next';
import { site } from './site';
import { faq, perfectFor, features } from './content';

const DESCRIPTION =
  'SpotBill is an all-in-one Android billing and POS app for shops, supermarkets, restaurants and wholesalers. GST invoices, barcode billing, offline billing, thermal printer support, stock and udhaar management. Kerala support team.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default:
      'SpotBill — Billing & POS App for Shops, Restaurants & Supermarkets | Kerala',
    template: '%s | SpotBill',
  },
  description: DESCRIPTION,
  applicationName: site.brand,
  keywords: [
    'billing app',
    'POS software',
    'GST billing software',
    'GST billing app Android',
    'KOT restaurant billing app',
    'barcode billing app',
    'offline billing app',
    'thermal printer billing app',
    'Kerala billing software',
    'udhaar credit management app',
    'supermarket billing software',
    'inventory management app India',
  ],
  authors: [{ name: site.parentBrand, url: site.parentSite }],
  creator: site.parentBrand,
  publisher: site.parentBrand,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.domain,
    siteName: site.brand,
    title:
      'SpotBill — Billing & POS App for Shops, Restaurants & Supermarkets',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpotBill — Smart Billing. Instant Growth.',
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/brand/spotbill-icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0B63F6' },
    ],
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: true, address: false, email: true },
  appleWebApp: {
    capable: true,
    title: site.brand,
    statusBarStyle: 'black-translucent',
  },
};

/** Per-route metadata for the three sub-pages. */
export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { title, description, url: `${site.domain}${pathname}` },
  };
}

/* --------------------------------------------------------------- JSON-LD */

const orgId = `${site.domain}/#organization`;
const appId = `${site.domain}/#app`;

function organization() {
  return {
    '@type': 'Organization',
    '@id': orgId,
    name: site.parentBrand,
    alternateName: 'IT World',
    slogan: site.parentTagline,
    url: site.parentSite,
    logo: `${site.domain}/icon-512.png`,
    image: `${site.domain}/icon-512.png`,
    telephone: site.phone,
    email: site.email,
    areaServed: { '@type': 'State', name: 'Kerala', containedInPlace: 'India' },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
  };
}

function application() {
  return {
    '@type': ['SoftwareApplication', 'MobileApplication'],
    '@id': appId,
    name: site.brand,
    alternateName: 'SpotBill Billing & POS',
    description: DESCRIPTION,
    image: `${site.domain}/opengraph-image`,
    operatingSystem: 'Android',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Billing and Point of Sale',
    downloadUrl: site.playStoreUrl,
    installUrl: site.playStoreUrl,
    softwareVersion: '1.0',
    publisher: { '@id': orgId },
    inLanguage: 'en-IN',
    offers: site.offerActive
      ? {
          '@type': 'Offer',
          price: site.launchOfferAmount,
          priceCurrency: 'INR',
          category: 'Lifetime licence',
          url: site.playStoreUrl,
          availability: 'https://schema.org/LimitedAvailability',
        }
      : {
          '@type': 'Offer',
          price: 0,
          priceCurrency: 'INR',
          url: site.playStoreUrl,
        },
    featureList: features.modules.flatMap((m) => m.bullets),
    audience: {
      '@type': 'BusinessAudience',
      audienceType: perfectFor.items.map((i) => i.title).join(', '),
    },
  };
}

/** Built from the same array the accordion renders, so the two cannot drift. */
function faqPage() {
  const items = site.offerActive ? [...faq.items, faq.offerItem] : faq.items;
  return {
    '@type': 'FAQPage',
    '@id': `${site.domain}/#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      application(),
      faqPage(),
      {
        '@type': 'WebSite',
        '@id': `${site.domain}/#website`,
        url: site.domain,
        name: site.brand,
        publisher: { '@id': orgId },
        inLanguage: 'en-IN',
      },
    ],
  };
}

export function subPageSchema(name: string, pathname: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${site.domain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name,
            item: `${site.domain}${pathname}`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name,
        url: `${site.domain}${pathname}`,
        isPartOf: { '@id': `${site.domain}/#website` },
      },
    ],
  };
}

/** Serialise safely for an inline <script type="application/ld+json">. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
