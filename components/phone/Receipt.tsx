'use client';

import QrBlock from '@/components/ui/QrBlock';
import { screens } from '@/lib/content';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { formatAmount } from '@/lib/utils';

const { billing, receipt } = screens;

const subtotal = billing.items.reduce((sum, i) => sum + i.qty * i.rate, 0);
const tax = subtotal * billing.taxRate;
// Half-and-remainder, the way a real bill splits an odd paisa.
const cgst = Math.floor((tax / 2) * 100) / 100;
const sgst = Math.round((tax - cgst) * 100) / 100;
const total = subtotal + tax;

function Rule() {
  return (
    <span
      aria-hidden="true"
      className="my-1 block border-t border-dashed border-sb-navy/25"
    />
  );
}

/**
 * The signature element: a thermal receipt.
 *
 * Purely presentational — the parent drives the reveal by tweening
 * `clip-path` on `[data-receipt]` and staggering `[data-receipt-line]`,
 * so the same component serves the hero's scroll-scrubbed print and the
 * printer section's button-triggered one.
 */
export default function Receipt({
  variant = 'full',
  className,
}: {
  variant?: 'short' | 'full';
  className?: string;
}) {
  const items = variant === 'short' ? billing.items.slice(0, 3) : billing.items;

  return (
    <div
      data-receipt
      className={cn(
        'sb-paper sb-torn w-[15.5rem] max-w-full px-4 pb-6 pt-4 shadow-[0_24px_50px_-24px_rgba(5,9,26,0.45)]',
        className,
      )}
      role="img"
      aria-label={`Sample SpotBill thermal receipt totalling ${formatAmount(total)} rupees`}
    >
      <div className="t-mono text-[0.58rem] leading-[1.5] text-sb-navy">
        <p data-receipt-line className="text-center text-[0.72rem] font-medium uppercase tracking-wider">
          {screens.business}
        </p>
        <p data-receipt-line className="text-center text-[0.5rem] text-sb-navy/70">
          GSTIN {screens.gstin}
        </p>
        <p data-receipt-line className="text-center text-[0.5rem] text-sb-navy/70">
          {site.location}
        </p>

        <Rule />

        <p data-receipt-line className="flex justify-between text-[0.52rem]">
          <span>{screens.invoiceNo}</span>
          <span>
            {receipt.date} {receipt.time}
          </span>
        </p>

        <Rule />

        <p
          data-receipt-line
          className="flex text-[0.5rem] uppercase tracking-wide text-sb-navy/65"
        >
          <span className="flex-1">Item</span>
          <span className="w-6 text-right">Qty</span>
          <span className="w-12 text-right">Rate</span>
          <span className="w-14 text-right">Amount</span>
        </p>

        {items.map((item) => (
          <p key={item.name} data-receipt-line className="flex">
            <span className="flex-1 truncate pr-1">{item.name}</span>
            <span className="w-6 text-right">{item.qty}</span>
            <span className="w-12 text-right">{formatAmount(item.rate)}</span>
            <span className="w-14 text-right">
              {formatAmount(item.qty * item.rate)}
            </span>
          </p>
        ))}

        <Rule />

        <p data-receipt-line className="flex justify-between">
          <span className="text-sb-navy/70">Subtotal</span>
          <span>{formatAmount(subtotal)}</span>
        </p>

        {variant === 'full' ? (
          <>
            <p data-receipt-line className="flex justify-between text-[0.52rem]">
              <span className="text-sb-navy/70">CGST 2.5%</span>
              <span>{formatAmount(cgst)}</span>
            </p>
            <p data-receipt-line className="flex justify-between text-[0.52rem]">
              <span className="text-sb-navy/70">SGST 2.5%</span>
              <span>{formatAmount(sgst)}</span>
            </p>
          </>
        ) : (
          <p data-receipt-line className="flex justify-between text-[0.52rem]">
            <span className="text-sb-navy/70">{billing.taxLabel}</span>
            <span>{formatAmount(tax)}</span>
          </p>
        )}

        <Rule />

        <p
          data-receipt-line
          className="flex items-baseline justify-between text-[0.85rem] font-medium"
        >
          <span className="text-[0.55rem] uppercase tracking-wider text-sb-navy/70">
            Total
          </span>
          <span>₹{formatAmount(total)}</span>
        </p>

        <Rule />

        {variant === 'full' ? (
          <>
            <p
              data-receipt-line
              className="mt-1 text-center text-[0.52rem] uppercase tracking-wider text-sb-navy/70"
            >
              {receipt.paidBy}
            </p>
            <span
              data-receipt-line
              className="mx-auto mt-2 block w-fit"
              style={{ ['--qr-bg' as string]: '#FFFDF7' }}
            >
              <QrBlock size={74} color="#0A1739" />
            </span>
            <p
              data-receipt-line
              className="mt-1.5 text-center text-[0.5rem] text-sb-navy/65"
            >
              {receipt.upiNote}
            </p>
            <p
              data-receipt-line
              className="mt-2 text-center text-[0.5rem] text-sb-navy/65"
            >
              {receipt.cashierLabel}: {receipt.cashier}
            </p>
          </>
        ) : null}

        <p
          data-receipt-line
          className="mt-2 text-center text-[0.55rem] uppercase tracking-wider"
        >
          {receipt.thanks}
        </p>
      </div>
    </div>
  );
}
