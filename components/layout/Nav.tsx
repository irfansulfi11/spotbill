'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import MobileDrawer from './MobileDrawer';
import { nav } from '@/lib/content';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Sticky nav.
 *
 * Two independent states:
 *  - `condensed` after 80px: 88px -> 64px, blurred ink background, hairline.
 *  - `onLight` when the bar is sitting over a light band, which swaps the
 *    logo and link colours. Driven by a ScrollTrigger per light section
 *    rather than by hard-coded offsets, so it survives content edits.
 */
export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const bands = Array.from(document.querySelectorAll('[data-band="light"]'));
    if (!bands.length || typeof IntersectionObserver === 'undefined') return;

    const active = new Set<Element>();

    // A 1px-tall detection line across the viewport at y=44 — the vertical
    // middle of the condensed bar. A band intersecting it is the surface the
    // nav is currently sitting on.
    const build = () =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) active.add(entry.target);
            else active.delete(entry.target);
          });
          setOnLight(active.size > 0);
        },
        { rootMargin: `-44px 0px -${Math.max(0, window.innerHeight - 45)}px 0px` },
      );

    let observer = build();
    bands.forEach((band) => observer.observe(band));

    // The detection line is expressed in pixels, so it has to be rebuilt
    // when the viewport height changes (every Android URL-bar collapse).
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        observer.disconnect();
        active.clear();
        observer = build();
        bands.forEach((band) => observer.observe(band));
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  const dark = !onLight;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[height,background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          condensed
            ? 'h-16 backdrop-blur-xl'
            : 'h-[72px] backdrop-blur-0 lg:h-[88px]',
          condensed && (dark ? 'bg-sb-ink/[0.72]' : 'bg-white/[0.78]'),
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 bottom-0 h-px transition-opacity duration-500',
            condensed ? 'opacity-100' : 'opacity-0',
            dark ? 'bg-sb-line-dark' : 'bg-sb-line',
          )}
        />

        <div className="sb-shell flex h-full items-center justify-between gap-6">
          <Logo tone={dark ? 'dark' : 'light'} />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative text-[0.9rem] font-medium transition-colors duration-300',
                  dark
                    ? 'text-white/70 hover:text-white'
                    : 'text-sb-navy/70 hover:text-sb-navy',
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-0 bg-sb-blue transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sb-gradient hidden rounded-full px-5 py-2.5 text-[0.85rem] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(11,99,246,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 md:inline-flex"
            >
              {nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={cn(
                'rounded-full border p-2.5 transition-colors lg:hidden',
                dark
                  ? 'border-sb-line-dark text-white hover:border-sb-blue-bright'
                  : 'border-sb-line text-sb-navy hover:border-sb-blue',
              )}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
