/**
 * User-facing copy for toast notifications. Centralised so tone stays
 * consistent and strings are never hardcoded inside components.
 */
export const TOAST_MESSAGES = {
  watchlistAdded: (name: string): string => `${name} added to watchlist`,
  watchlistRemoved: (name: string): string => `${name} removed from watchlist`,
  refreshComplete: 'Market data updated',
  retrySuccess: 'Data loaded successfully',
  offline: 'You are offline — showing cached data',
  backOnline: 'Connection restored',
  apiError: 'Unable to load market data. Please try again.',
} as const;
