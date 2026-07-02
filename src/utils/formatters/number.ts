import { DEFAULT_LOCALE, EMPTY_VALUE } from './constants';

/** Format a plain number using locale-aware grouping, e.g. `1,234,567`. */
export function formatNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions,
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || !Number.isFinite(value)) return EMPTY_VALUE;
  return new Intl.NumberFormat(locale, options).format(value);
}
