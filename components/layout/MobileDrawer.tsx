'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import PlayBadge from '@/components/ui/PlayBadge';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useScrollLock } from './ScrollLock';
import { nav } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

export default function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open || !panel.current) return;

    closeRef.current?.focus();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from(panel.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5,
          ease: 'power3.out',
        })
        .from(
          '[data-drawer-item]',
          { y: 28, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
          '-=0.25',
        );
    }, panel);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panel}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col bg-sb-ink lg:hidden"
    >
      <div className="flex items-center justify-between px-5 py-5">
        <Logo tone="dark" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full border border-sb-line-dark p-2.5 text-white transition-colors hover:border-sb-blue-bright hover:text-sb-blue-bright"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-1 px-5">
        {nav.links.map((link, index) => (
          <a
            key={link.href}
            data-drawer-item
            href={link.href}
            onClick={onClose}
            className="group flex items-baseline gap-4 border-b border-sb-line-dark py-4 text-white"
          >
            <span className="t-mono-sm w-8 text-sb-blue-bright opacity-70">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="t-h3 uppercase transition-colors group-hover:text-sb-blue-bright">
              {link.label}
            </span>
          </a>
        ))}
      </nav>

      <div
        data-drawer-item
        className="flex flex-col gap-4 border-t border-sb-line-dark px-5 py-6"
      >
        <PlayBadge height={48} />
        <div className="t-mono-sm flex flex-col gap-1.5 text-white/60">
          <a href={site.phoneHref} className="hover:text-sb-blue-bright">
            {site.phone}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sb-blue-bright"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}
