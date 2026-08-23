import { Fragment } from 'react';

const SPLIT = /(₹[\d,]+(?:\.\d+)?)/g;
const IS_AMOUNT = /^₹[\d,]+(?:\.\d+)?$/;

/**
 * Renders body copy with any rupee amount set in the mono face.
 *
 * This is the site's typographic rule (§3.2 — every rupee amount is mono)
 * applied to running text, and it has a second effect worth knowing about:
 * `₹` (U+20B9) lives in Google Fonts' `latin-ext` subset, so a single ₹ in
 * a sentence pulls a whole extra 90KB Inter Tight file down. Keeping the
 * glyph inside the mono face confines that cost to JetBrains Mono's much
 * smaller latin-ext file, which the receipt needs anyway.
 */
export default function Rupees({ children }: { children: string }) {
  const parts = children.split(SPLIT);

  return (
    <>
      {parts.map((part, index) =>
        IS_AMOUNT.test(part) ? (
          <span key={index} className="t-mono text-[0.95em]">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
