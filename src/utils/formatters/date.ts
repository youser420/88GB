import dayjs from 'dayjs';

import { EMPTY_VALUE } from './constants';

/** Default display template for absolute dates. */
const DEFAULT_DATE_TEMPLATE = 'MMM D, YYYY h:mm A';

/** Format a date/time value; returns a placeholder for missing/invalid input. */
export function formatDate(
  value: string | number | Date | null | undefined,
  template: string = DEFAULT_DATE_TEMPLATE,
): string {
  // Guard null/undefined explicitly: `dayjs(undefined)` resolves to "now".
  if (value == null) return EMPTY_VALUE;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(template) : EMPTY_VALUE;
}
