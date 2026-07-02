/**
 * Cache lifetimes (in milliseconds) for the in-memory response cache.
 * Centralised here so tuning is a one-line change and never a magic number.
 */
export const CACHE_DURATION_MS = {
  /** Top coins list is volatile; keep it fresh for a minute. */
  TOP_COINS: 60_000,
  /** Coin detail changes more slowly; cache for five minutes. */
  COIN_DETAILS: 5 * 60_000,
} as const;
