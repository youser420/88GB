/**
 * Keys used for browser storage. Namespaced with an app prefix to avoid
 * collisions with other apps served from the same origin.
 */
const STORAGE_PREFIX = 'cmp';

export const STORAGE_KEYS = {
  /** Persisted Zustand crypto store (watchlist only). */
  CRYPTO_STORE: `${STORAGE_PREFIX}:crypto-store`,
  /** Persisted theme preference. */
  THEME: `${STORAGE_PREFIX}:theme`,
} as const;
