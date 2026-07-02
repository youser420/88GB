import { DEFAULT_CURRENCY } from '@/constants';

import { DEFAULT_LOCALE, EMPTY_VALUE } from './constants';

/**
 * `Intl.NumberFormat` instances are relatively expensive to construct, so we
 * memoise them by their formatting signature.
 */
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/** Format a value as currency, e.g. `$1,234.56`. */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || !Number.isFinite(value)) return EMPTY_VALUE;
  // Sub-dollar assets need more precision to remain meaningful.
  const maximumFractionDigits = Math.abs(value) < 1 ? 6 : 2;
  return getFormatter(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits,
  }).format(value);
}

/** Format a large value compactly, e.g. `$1.2B`. */
export function formatCompactCurrency(
  value: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || !Number.isFinite(value)) return EMPTY_VALUE;
  return getFormatter(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}
