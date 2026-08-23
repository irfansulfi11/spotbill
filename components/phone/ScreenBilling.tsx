'use client';

import { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Menu,
  QrCode,
  ScanBarcode,
  Search,
  Sparkle,
  Zap,
} from 'lucide-react';
import LogoMark from '@/components/ui/LogoMark';
import { SCREEN_H, SCREEN_W } from './PhoneFrame';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';
import { formatINR } from '@/lib/utils';

const { billing } = screens;

/**
 * The app's billing counter, 1:1.
 *
 * Unlike the other five screens — which are drawn straight at the frame's
 * 258px design width — this one is laid out at true device dimensions
 * (390 × 781 CSS px, an ordinary phone viewport) and then scaled into the
 * frame. That is the only way the proportions, tap targets and type sizes
 * come out as the shipped app has them rather than as a re-drawing of it.
 * Every number below is a real device pixel.
 */
const DEVICE_W = 390;
const SCALE = SCREEN_W / DEVICE_W;
const DEVICE_H = SCREEN_H / SCALE;

/**
 * Tile art. These gradients stand in for the catalogue photography the app
 * pulls from the shop's own product records — they are not brand colours,
 * which is why they live here and not in the token block.
 */
const ART: Record<string, { emoji: string; tint: string }> = {
  sausage: { emoji: '🌭', tint: 'linear-gradient(155deg,#f7dcbb,#e3a869)' },
  pepsi: { emoji: '🥤', tint: 'linear-gradient(155deg,#ccd8ef,#8b9fc6)' },
  tea: { emoji: '🍵', tint: 'linear-gradient(155deg,#f3e4ce,#d7b382)' },
  corndog: { emoji: '🍢', tint: 'linear-gradient(155deg,#f8ddb4,#dfa15e)' },
  salad: { emoji: '🥗', tint: 'linear-gradient(155deg,#e4f1d5,#a8ce85)' },
  burrito: { emoji: '🌯', tint: 'linear-gradient(155deg,#f6e7c9,#dbba7c)' },
  croissant: { emoji: '🥐', tint: 'linear-gradient(155deg,#f9e3be,#e0af69)' },
  yogurt: { emoji: '🍨', tint: 'linear-gradient(155deg,#f7e8f2,#dbbfd5)' },
  coffee: { emoji: '☕', tint: 'linear-gradient(155deg,#e9d6c3,#b88c67)' },
};

/** Cart rows add in, the bill total counts up, then the Bill button lands. */
export default function ScreenBilling() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (prefersReducedMotion()) {
      if (totalRef.current) {
        totalRef.current.textContent = formatINR(billing.cartTotal);
      }
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });

      tl.from('[data-bill-tile]', {
        opacity: 0,
        y: 10,
        scale: 0.94,
        duration: 0.42,
        stagger: 0.035,
        ease: 'power3.out',
      })
        .from(
          '[data-bill-row]',
          {
            y: 14,
            opacity: 0,
            duration: 0.5,
            stagger: 0.13,
            ease: 'power3.out',
          },
          0.15,
        )
        .to(
          counter,
          {
            value: billing.cartTotal,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              if (totalRef.current) {
                totalRef.current.textContent = formatINR(counter.value);
              }
            },
          },
          0.3,
        )
        .from(
          '[data-bill-pay]',
          { scale: 0.94, duration: 0.4, ease: 'back.out(2)' },
          '-=0.4',
        )
        .set(counter, { value: 0 }, '+=2.4');
    }, ref);

    return () => ctx.revert();
  }, [inView, ref]);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <div
        role="img"
        aria-label={`SpotBill — ${billing.title}`}
        className="flex origin-top-left flex-col bg-white"
        style={{
          width: DEVICE_W,
          height: DEVICE_H,
          transform: `scale(${SCALE})`,
        }}
      >
        {/* ---------------------------------------------------- app bar */}
        <header className="flex h-[52px] shrink-0 items-center px-4">
          <Menu
            className="h-[23px] w-[23px] shrink-0 text-sb-navy"
            strokeWidth={2.6}
            aria-hidden="true"
          />
          <span className="flex flex-1 items-center justify-center gap-[7px] pr-6">
            <LogoMark className="h-[26px] w-[26px] shrink-0" variant="color" />
            <span className="t-lean font-display text-[23px] font-extrabold uppercase leading-none tracking-[-0.035em] text-sb-navy">
              SpotBill
            </span>
          </span>
        </header>

        {/* ----------------------------------------------- mode toolbar */}
        <div className="flex shrink-0 items-center justify-center gap-[18px] pb-[9px]">
          <ScanBarcode
            className="h-[19px] w-[19px] text-sb-navy"
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span className="flex items-center gap-[5px] rounded-full border border-sb-line px-[13px] py-[5px] text-[12.5px] font-medium leading-none text-sb-navy">
            {billing.modeLabel}
            <ChevronDown
              className="h-[13px] w-[13px] text-sb-navy/55"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>
          <span className="flex items-center gap-[5px] text-[12.5px] font-medium leading-none text-sb-navy">
            <Search
              className="h-[14px] w-[14px]"
              strokeWidth={2.1}
              aria-hidden="true"
            />
            {billing.kotLabel}
          </span>
          <span className="flex items-center gap-[4px] text-[12.5px] font-semibold leading-none text-sb-red">
            <Sparkle
              className="h-[13px] w-[13px] fill-sb-red"
              strokeWidth={2}
              aria-hidden="true"
            />
            {billing.clearLabel}
          </span>
        </div>

        {/* ------------------------------------------------------- cart */}
        <div className="shrink-0 px-4">
          {billing.cart.map((row) => (
            <div
              key={row.name}
              data-bill-row
              className="flex items-center gap-3 border-b border-sb-line/80 py-[11px]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-bold uppercase leading-none tracking-[0.01em] text-sb-navy">
                  {row.name}
                </p>
                <p className="mt-[5px] text-[11.5px] leading-none text-sb-navy/55">
                  {formatINR(row.rate)} x {row.qty} {billing.unitLabel}
                </p>
              </div>
              <span className="flex items-center gap-[9px]" aria-hidden="true">
                <CircleMinus
                  className="h-[19px] w-[19px] text-sb-navy/45"
                  strokeWidth={1.6}
                />
                <span className="w-[9px] text-center text-[13px] font-semibold text-sb-navy">
                  {row.qty}
                </span>
                <CirclePlus
                  className="h-[19px] w-[19px] text-sb-navy/45"
                  strokeWidth={1.6}
                />
              </span>
              <span className="w-[44px] text-right text-[13.5px] font-bold text-sb-navy">
                {formatINR(row.qty * row.rate)}
              </span>
            </div>
          ))}
          {/* the cart runs longer than the rows on screen */}
          <div className="flex justify-center py-[3px]" aria-hidden="true">
            <ChevronDown className="h-[17px] w-[17px] text-sb-navy/40" />
          </div>
        </div>

        {/* ----------------------------------------------------- search */}
        <div className="flex shrink-0 items-center gap-3 px-4 py-[8px]">
          <ArrowLeft
            className="h-[19px] w-[19px] shrink-0 text-sb-navy"
            strokeWidth={2.1}
            aria-hidden="true"
          />
          <div className="flex flex-1 items-center gap-[9px] rounded-full border border-sb-line bg-white px-[15px] py-[10px] shadow-[0_1px_4px_rgba(10,23,57,0.07)]">
            <Search
              className="h-[16px] w-[16px] text-sb-navy/45"
              strokeWidth={2.1}
              aria-hidden="true"
            />
            <span className="text-[13px] leading-none text-sb-navy/40">
              {billing.searchPlaceholder}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------- catalogue grid */}
        <div className="min-h-0 flex-1 overflow-hidden px-[11px] pt-[6px]">
          <div className="grid grid-cols-3 gap-[9px]">
            {billing.catalogue.map((tile) => (
              <div
                key={tile.name}
                data-bill-tile
                className="overflow-hidden rounded-[10px] border border-sb-line bg-white shadow-[0_1px_2px_rgba(10,23,57,0.05)]"
              >
                <div
                  className="relative h-[94px] w-full"
                  style={{ backgroundImage: ART[tile.art].tint }}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-full place-items-center text-[38px] leading-none"
                  >
                    {ART[tile.art].emoji}
                  </span>
                  <span className="absolute left-[5px] top-[5px] rounded-[5px] bg-white/95 px-[5px] py-[2px] text-[10.5px] font-bold leading-none text-sb-navy shadow-[0_1px_2px_rgba(10,23,57,0.12)]">
                    {formatINR(tile.price)}
                  </span>
                </div>
                <p className="py-[7px] text-center text-[10px] font-semibold uppercase leading-none tracking-[0.07em] text-sb-navy/85">
                  {tile.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------- action bar */}
        <div className="flex shrink-0 items-center gap-[7px] border-t border-sb-line px-[11px] pb-[14px] pt-[10px]">
          <span className="flex h-[44px] w-[48px] items-center justify-center rounded-[10px] border border-sb-line">
            <QrCode
              className="h-[20px] w-[20px] text-sb-blue"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>
          <span className="flex h-[44px] items-center gap-[6px] rounded-[10px] border border-sb-line px-[11px]">
            <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-sb-blue">
              <Zap
                className="h-[11px] w-[11px] fill-white text-white"
                aria-hidden="true"
              />
            </span>
            <span className="text-[12.5px] font-semibold leading-none text-sb-navy">
              {billing.quickSaleLabel}
            </span>
          </span>
          <span
            data-bill-pay
            className="flex h-[44px] flex-1 items-center justify-center gap-[8px] rounded-[10px] bg-sb-blue-deep text-white shadow-[0_6px_14px_-6px_rgba(10,68,184,0.9)]"
          >
            <ScanBarcode
              className="h-[18px] w-[18px]"
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <span className="text-[14.5px] font-bold leading-none">
              {billing.billLabel}{' '}
              <span ref={totalRef} className="t-mono font-semibold">
                {formatINR(billing.cartTotal)}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
