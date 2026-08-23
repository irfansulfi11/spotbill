/** Tiny class joiner — no clsx dependency needed for a site this size. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const inr = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const inr2 = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Indian digit grouping — ₹3,708 and not ₹3.708.
 * Every rupee figure on this site goes through here.
 */
export function formatINR(value: number, decimals = false): string {
  return `₹${decimals ? inr2.format(value) : inr.format(value)}`;
}

/** Grouping without the symbol, for receipt columns that align on the digits. */
export function formatAmount(value: number, decimals = true): string {
  return decimals ? inr2.format(value) : inr.format(value);
}
