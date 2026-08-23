'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'white';

const base =
  'sb-btn-glow group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-semibold leading-none transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-7';

const variants: Record<Variant, string> = {
  primary: 'sb-gradient text-white shadow-[0_10px_30px_-12px_rgba(11,99,246,0.9)]',
  outline:
    'border border-sb-line-dark bg-white/[0.03] text-white hover:border-sb-blue-bright hover:bg-white/[0.07]',
  ghost:
    'border border-sb-line bg-white text-sb-navy hover:border-sb-blue hover:text-sb-blue',
  white: 'bg-white text-sb-navy hover:bg-sb-cloud',
};

/**
 * Magnetic pull, capped at 8px, plus a glow that expands from the pointer
 * position. Both are pointer-only: a touch device never gets either, and
 * `matchMedia` keeps them off entirely under reduced motion.
 */
function useMagnetic(max = 8) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || event.pointerType !== 'mouse') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);

      gsap.to(el, {
        x: ((x - rect.width / 2) / rect.width) * max * 2,
        y: ((y - rect.height / 2) / rect.height) * max * 2,
        duration: 0.4,
        ease: 'power3.out',
      });
    },
    [max],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  }, []);

  return { ref, onMove, onLeave };
}

export type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  withArrow?: boolean;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit';
};

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  withArrow = true,
  external,
  className,
  ariaLabel,
  type = 'button',
}: ButtonProps) {
  const magnetic = useMagnetic();

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      ) : null}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (href) {
    const isExternal = external ?? /^https?:|^tel:|^mailto:/.test(href);
    const Tag = isExternal ? 'a' : Link;

    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={magnetic.ref as any}
        href={href}
        aria-label={ariaLabel}
        className={classes}
        onPointerMove={magnetic.onMove}
        onPointerLeave={magnetic.onLeave}
        {...(isExternal
          ? { target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
          : {})}
      >
        {content}
      </Tag>
    );
  }

  return (
    <button
      ref={magnetic.ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      onPointerMove={magnetic.onMove}
      onPointerLeave={magnetic.onLeave}
    >
      {content}
    </button>
  );
}
