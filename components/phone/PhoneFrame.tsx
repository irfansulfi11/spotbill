'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Device shell for the live screens.
 *
 * The screens are laid out once at a fixed design width and then scaled to
 * whatever box the frame is given, so the same components serve the 272px
 * hero device and the 120px thumbnail in a stacked mobile card without any
 * of them reflowing into nonsense.
 *
 * The aspect ratio is declared in CSS so the box is reserved before
 * hydration — this is the one element big enough to cause visible CLS.
 */
const BASE_W = 258;
const RATIO = 19.2 / 9;
const STATUS_H = 34;

/**
 * The layout box a screen is handed, in design pixels. Screens drawn at real
 * device dimensions (ScreenBilling) scale themselves against these rather
 * than hard-coding a second copy of the frame's geometry.
 */
export const SCREEN_W = BASE_W;
export const SCREEN_H = BASE_W * RATIO - STATUS_H;

export default function PhoneFrame({
  children,
  className,
  glow = true,
  statusTime = '10:24',
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  statusTime?: string;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const width = screen.current?.clientWidth;
    if (width) setScale(width / BASE_W);
  }, []);

  useLayoutEffect(() => {
    measure();
    if (!screen.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(screen.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div className={cn('relative', className)}>
      {glow ? (
        <div
          aria-hidden="true"
          className="sb-gradient pointer-events-none absolute -inset-8 -z-10 rounded-[999px] opacity-25 blur-3xl"
        />
      ) : null}

      <div className="relative rounded-[2.2rem] border border-white/10 bg-sb-ink p-[7px] shadow-[0_40px_80px_-40px_rgba(5,9,26,0.9)] sm:rounded-[2.6rem] sm:p-2.5">
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[22%] h-9 w-[3px] rounded-l bg-white/15"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[34%] h-14 w-[3px] rounded-l bg-white/15"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[2px] top-[26%] h-16 w-[3px] rounded-r bg-white/15"
        />

        <div
          ref={screen}
          className="relative aspect-[9/19.2] w-full overflow-hidden rounded-[1.8rem] bg-[#F7F9FE] sm:rounded-[2.1rem]"
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: BASE_W,
              height: BASE_W * RATIO,
              transform: `scale(${scale})`,
            }}
          >
            {/* status bar */}
            <div className="relative z-20 flex items-center justify-between px-5 pb-1 pt-2.5">
              <span className="t-mono text-[0.62rem] font-medium text-sb-navy">
                {statusTime}
              </span>
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2 h-[18px] w-[62px] -translate-x-1/2 rounded-full bg-sb-ink"
              />
              <span className="flex items-center gap-1" aria-hidden="true">
                <svg viewBox="0 0 16 12" className="h-2.5 w-3.5 fill-sb-navy">
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
                  <rect x="9" y="3" width="3" height="9" rx="1" />
                  <rect x="13" y="0.5" width="3" height="11.5" rx="1" opacity="0.35" />
                </svg>
                <svg viewBox="0 0 24 12" className="h-2.5 w-4 fill-sb-navy">
                  <rect
                    x="0"
                    y="1.5"
                    width="19"
                    height="9"
                    rx="2.5"
                    fill="none"
                    className="stroke-sb-navy"
                    strokeWidth="1.4"
                  />
                  <rect x="1.6" y="3.1" width="13" height="5.8" rx="1.4" />
                  <rect x="20.6" y="4.2" width="2" height="3.6" rx="1" />
                </svg>
              </span>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 flex flex-col"
              style={{ top: STATUS_H, height: SCREEN_H }}
            >
              {children}
            </div>

            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-sb-navy/25"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
