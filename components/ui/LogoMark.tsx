'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * The SpotBill mark, inlined so it can be recoloured with `currentColor`
 * and animated (the load sequence draws the bolt in).
 *
 * `variant="mono"` paints the whole mark in the inherited text colour — the
 * reverse lockup for navy and blue surfaces. Gaps are masked, not painted,
 * so the artwork sits cleanly on any background.
 */
export default function LogoMark({
  variant = 'color',
  className,
}: {
  variant?: 'color' | 'mono';
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const blue = variant === 'mono' ? 'currentColor' : 'var(--color-sb-blue)';
  const navy = variant === 'mono' ? 'currentColor' : 'var(--color-sb-navy)';

  const BOLT = 'M176 26 L112 136 L142 136 L120 240 L188 120 L152 120 Z';

  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('block', className)}
      role="img"
      aria-label="SpotBill"
      focusable="false"
    >
      <defs>
        <mask
          id={`gap-${uid}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="256"
          height="256"
        >
          <rect width="256" height="256" fill="#fff" />
          <path
            d={BOLT}
            fill="none"
            stroke="#000"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <g fill="#000">
            <rect x="193" y="36" width="34" height="7" rx="3.5" />
            <rect x="193" y="52" width="34" height="7" rx="3.5" />
            <rect x="193" y="68" width="23" height="7" rx="3.5" />
          </g>
        </mask>
      </defs>

      <g mask={`url(#gap-${uid})`}>
        <g fill={blue} data-logo-speed>
          <rect x="14" y="164" width="86" height="15" rx="7.5" />
          <rect x="28" y="192" width="72" height="15" rx="7.5" />
          <rect x="48" y="220" width="52" height="15" rx="7.5" />
        </g>
        <path
          d="M184 14 h42 a10 10 0 0 1 10 10 v82 l-8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.5 8.5 z"
          fill={navy}
        />
        <path
          d="M164 54 C164 34 138 24 112 28 C82 33 66 57 82 75 C94 89 122 92 144 100 C166 108 172 126 156 136 C140 146 108 146 94 132"
          fill="none"
          stroke={blue}
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-logo-s
        />
        <path
          d="M138 122 L138 224 L172 224 C206 224 224 200 224 173 C224 146 206 122 172 122 L138 122"
          fill="none"
          stroke={navy}
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-logo-d
        />
      </g>
      <path d={BOLT} fill={blue} data-logo-bolt />
    </svg>
  );
}
