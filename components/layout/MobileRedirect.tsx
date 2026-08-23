import { site } from '@/lib/site';

/**
 * Sends Android visitors straight to the Play Store listing. Rendered as a
 * blocking inline script (not a `useEffect`) so it fires before the rest of
 * the static HTML paints — no flash of the marketing page first.
 *
 * iOS is left alone: there's no App Store listing to send those visitors to,
 * so they get the normal site.
 */
export default function MobileRedirect() {
  const script = `if(/Android/i.test(navigator.userAgent)){window.location.replace(${JSON.stringify(
    site.playStoreUrl,
  )});}`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
