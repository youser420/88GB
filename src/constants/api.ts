/**
 * API configuration and endpoint definitions.
 *
 * The base URL is sourced from the environment so it can be swapped per
 * deployment; a sensible public default keeps local development frictionless.
 */

const DEFAULT_API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const API_BASE_URL: string =
  import.meta.env.VITE_COINGECKO_API_URL || DEFAULT_API_BASE_URL;

/** Request timeout in milliseconds. */
export const API_TIMEOUT_MS = 10_000;

/**
 * Automatic retry policy for transient failures (network errors, timeouts,
 * 5xx, and 429). Applies to idempotent GET requests only.
 */
export const API_RETRY = {
  /** Maximum number of retry attempts after the initial request. */
  MAX_ATTEMPTS: 3,
  /** Base delay for exponential backoff, in milliseconds. */
  BASE_DELAY_MS: 400,
  /** Upper bound for any single backoff delay, in milliseconds. */
  MAX_DELAY_MS: 8_000,
} as const;

/** Default headers applied to every request. */
export const DEFAULT_HEADERS = {
  Accept: 'application/json',
} as const;

/**
 * Endpoint paths (relative to {@link API_BASE_URL}).
 * Never hardcode URLs elsewhere in the codebase.
 */
export const API_ENDPOINTS = {
  MARKETS: '/coins/markets',
  COIN_DETAILS: (id: string): string => `/coins/${encodeURIComponent(id)}`,
  SEARCH: '/search',
} as const;

/** Default fiat currency used for market data. */
export const DEFAULT_CURRENCY = 'usd';

/** Number of coins requested for the "top coins" market view. */
export const TOP_COINS_PER_PAGE = 50;

/** Ordering used for the "top coins" market view. */
export const TOP_COINS_ORDER = 'market_cap_desc';
