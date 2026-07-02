import {
  API_ENDPOINTS,
  CACHE_DURATION_MS,
  DEFAULT_CURRENCY,
  TOP_COINS_ORDER,
  TOP_COINS_PER_PAGE,
} from '@/constants';
import { apiClient, NetworkError, toAppError } from '@/services';
import { createTtlCache, type TtlCache } from '@/utils';

import type {
  Coin,
  CoinDetail,
  GetTopCoinsOptions,
  SearchResult,
} from '../types';

/**
 * Contract for crypto data access. The store depends on this abstraction
 * (not on Axios), which keeps the two decoupled and makes the service trivial
 * to mock in tests.
 */
export interface CryptoService {
  getTopCoins(options?: GetTopCoinsOptions): Promise<Coin[]>;
  getCoinDetails(id: string): Promise<CoinDetail>;
  searchCoins(query: string): Promise<SearchResult>;
}

const topCoinsCache = createTtlCache<Coin[]>(CACHE_DURATION_MS.TOP_COINS);
const coinDetailsCache = createTtlCache<CoinDetail>(
  CACHE_DURATION_MS.COIN_DETAILS,
);

// Coalesce concurrent identical requests so a single network call is shared
// (e.g. React StrictMode double-mount, or overlapping refreshes).
const topCoinsInFlight = new Map<string, Promise<Coin[]>>();
const coinDetailsInFlight = new Map<string, Promise<CoinDetail>>();

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/**
 * Fetch-through-cache with offline/error fallback and in-flight de-duplication.
 * Encapsulates the shared caching policy so individual endpoints stay free of
 * duplicated logic.
 */
async function fetchWithCache<T>(
  cache: TtlCache<T>,
  inFlight: Map<string, Promise<T>>,
  key: string,
  request: () => Promise<T>,
): Promise<T> {
  const fresh = cache.get(key);
  if (fresh !== undefined) return fresh;

  // Offline: serve stale data if we have it, otherwise fail explicitly.
  if (isOffline()) {
    const stale = cache.getStale(key);
    if (stale !== undefined) return stale;
    throw new NetworkError();
  }

  const pending = inFlight.get(key);
  if (pending !== undefined) return pending;

  const promise = (async (): Promise<T> => {
    try {
      const data = await request();
      cache.set(key, data);
      return data;
    } catch (error) {
      // Best-effort fallback to stale data before surfacing the error.
      const stale = cache.getStale(key);
      if (stale !== undefined) return stale;
      throw toAppError(error);
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

async function getTopCoins(options: GetTopCoinsOptions = {}): Promise<Coin[]> {
  const currency = options.currency ?? DEFAULT_CURRENCY;
  const perPage = options.perPage ?? TOP_COINS_PER_PAGE;
  const page = options.page ?? 1;
  const cacheKey = `${currency}:${perPage}:${page}`;

  return fetchWithCache(topCoinsCache, topCoinsInFlight, cacheKey, async () => {
    const { data } = await apiClient.get<Coin[]>(API_ENDPOINTS.MARKETS, {
      params: {
        vs_currency: currency,
        order: TOP_COINS_ORDER,
        per_page: perPage,
        page,
        price_change_percentage: '24h',
        sparkline: false,
      },
    });
    return data;
  });
}

async function getCoinDetails(id: string): Promise<CoinDetail> {
  return fetchWithCache(coinDetailsCache, coinDetailsInFlight, id, async () => {
    const { data } = await apiClient.get<CoinDetail>(
      API_ENDPOINTS.COIN_DETAILS(id),
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      },
    );
    return data;
  });
}

async function searchCoins(query: string): Promise<SearchResult> {
  const trimmed = query.trim();
  if (!trimmed) return { coins: [] };

  // Search is not cached; without a network connection there is nothing to do.
  if (isOffline()) throw new NetworkError();

  try {
    const { data } = await apiClient.get<SearchResult>(API_ENDPOINTS.SEARCH, {
      params: { query: trimmed },
    });
    return data;
  } catch (error) {
    throw toAppError(error);
  }
}

/** Default, singleton implementation used across the app. */
export const coinGeckoService: CryptoService = {
  getTopCoins,
  getCoinDetails,
  searchCoins,
};

/** Clear all in-memory caches (primarily useful for tests). */
export function clearCryptoCaches(): void {
  topCoinsCache.clear();
  coinDetailsCache.clear();
}
