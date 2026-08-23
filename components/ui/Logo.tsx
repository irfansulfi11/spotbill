'use client';

import Link from 'next/link';
import LogoMark from './LogoMark';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Mark + wordmark lockup. The wordmark is live text in the display face
 * rather than an image: crisper on every DPI, and it recolours for free
 * when the nav crosses from a dark band into a light one.
 */
export default function Logo({
  tone = 'dark',
  withTagline = false,
  className,
  href = '/',
}: {
  /** `dark` = sitting on a dark surface (reverse mark). */
  tone?: 'dark' | 'light';
  withTagline?: boolean;
  className?: string;
  href?: string | null;
}) {
  const mono = tone === 'dark';

  const inner = (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark
        variant={mono ? 'mono' : 'color'}
        className={cn('h-9 w-9 shrink-0 sm:h-10 sm:w-10', mono && 'text-white')}
      />
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.6rem] font-extrabold uppercase leading-none tracking-[-0.035em] sm:text-[1.8rem]"
        >
          <span className={mono ? 'text-white' : 'text-sb-navy'}>Spot</span>
          <span className={mono ? 'text-sb-blue-bright' : 'text-sb-blue'}>
            Bill
          </span>
        </span>
        {withTagline ? (
          <span
            className={cn(
              't-mono-sm mt-1.5 whitespace-nowrap text-[0.6rem] leading-none',
              mono ? 'text-white/65' : 'text-sb-navy/65',
            )}
          >
            {site.tagline}
          </span>
        ) : null}
      </span>
      <span className="sr-only">{site.brand}</span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label={`${site.brand} — home`} className="shrink-0">
      {inner}
    </Link>
  );
}
