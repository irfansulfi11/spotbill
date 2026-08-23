/**
 * Site-wide configuration — the VARIABLES block from the brief.
 * Everything a client would ever want to change without touching a component
 * lives here or in `lib/content.ts`.
 *
 * Values still marked TODO are tracked in NOTES.md.
 */

export const site = {
  brand: 'SpotBill',
  tagline: 'Smart Billing. Instant Growth.',
  parentBrand: 'IT WORLD EXPERIENCE STORE',
  parentTagline: "Don't just buy, experience first",

  /** TODO — replace with the live domain once DNS is pointed. */
  domain: 'https://spotbill.in',

  playStoreUrl:
    'https://play.google.com/store/apps/details?id=com.spotbill.app',
  playStoreAppId: 'com.spotbill.app',

  phone: '+91 88917 89407',
  phoneHref: 'tel:+918891789407',
  whatsapp: '918891789407',
  email: 'itworldindia789@gmail.com',
  location: 'Kerala, India',
  parentSite: 'https://www.myitworld.in',

  launchOffer: '₹5,000/- Lifetime License',
  launchOfferAmount: 5000,

  /**
   * Master switch for every offer surface on the site: the hero ribbon, the
   * pricing section, the nav pill copy and the offer FAQ entry.
   * Set to `false` when the launch promotion ends — nothing else to change.
   */
  offerActive: true,

  logoLight: '/brand/spotbill-logo.svg',
  logoDark: '/brand/spotbill-logo-white.svg',
  appIcon: '/brand/spotbill-icon.svg',
} as const;

/** Pre-composed WhatsApp deep link with a sensible opening message. */
export function whatsappLink(
  message = "Hi, I'd like to know more about SpotBill billing app.",
): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
