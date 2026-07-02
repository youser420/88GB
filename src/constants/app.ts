export const APP_NAME = 'Crypto Market Pulse';

/** Human-readable app version surfaced in the footer. */
export const APP_VERSION = '0.1.0';

export const ROUTES = {
  DASHBOARD: '/',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** How often the UI may auto-refresh market data (milliseconds). */
export const REFRESH_INTERVAL_MS = 60_000;

/** Debounce delay applied to the search input (milliseconds). */
export const SEARCH_DEBOUNCE_MS = 300;

/** Number of coins surfaced by the top gainers / losers selectors. */
export const MOVERS_LIST_SIZE = 5;

/** Number of coins shown per page in the dashboard list. */
export const DASHBOARD_PAGE_SIZE = 10;
