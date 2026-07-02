import { EMPTY_VALUE } from './constants';

/**
 * Format a percentage value that is already expressed in percent units
 * (e.g. the API returns `2.5` to mean `2.5%`). A leading sign is added so
 * gains and losses read clearly, e.g. `+2.50%` / `-1.30%`.
 */
export function formatPercentage(
  value: number | null | undefined,
  fractionDigits = 2,
): string {
  if (value == null || !Number.isFinite(value)) return EMPTY_VALUE;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(fractionDigits)}%`;
}
