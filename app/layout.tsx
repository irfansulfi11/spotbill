import type { Metadata, Viewport } from 'next';
import { Archivo, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import Preloader from '@/components/layout/Preloader';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { defaultMetadata } from '@/lib/seo';
import './globals.css';

/**
 * Self-hosted via next/font — no render-blocking CDN request, no CLS from a
 * late swap. Only the display face is preloaded; it paints the LCP heading.
 */
/**
 * Weight-variable only. Adding the `wdth` axis takes this file from 35KB to
 * 90KB on the LCP critical path — a real cost on the mid-range Android over
 * 4G this site is built for. The brand's wide display feel is recovered
 * with size and tracking in `.t-h1` / `.t-h2` instead.
 */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-archivo',
});

/**
 * Preloaded as well as the display face: on mobile the hero's sub-paragraph
 * is the LCP element, so leaving this to a late swap moves LCP directly.
 */
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
  variable: '--font-inter-tight',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains',
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: '#0B63F6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <Preloader />
        {/* Scroll reveals hide their elements in CSS, so without JavaScript
            nothing would ever un-hide them — and the preloader's hide script
            never runs, so it has to be forced off too. */}
        <noscript>
          <style>
            {'[data-reveal]{opacity:1!important;transform:none!important}#sb-preloader{display:none!important}'}
          </style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-sb-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
