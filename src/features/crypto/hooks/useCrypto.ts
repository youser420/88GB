import {
  selectVisibleCoins,
  selectWatchlistedCoins,
  useCryptoStore,
  type CryptoErrorInfo,
} from '@/store';

import type { Coin, CoinDetail } from '../types';

export interface UseCryptoResult {
  coins: Coin[];
  visibleCoins: Coin[];
  watchlistedCoins: Coin[];
  selectedCoin: CoinDetail | null;
  loading: boolean;
  detailsLoading: boolean;
  error: CryptoErrorInfo | null;
  lastUpdated: number | null;
  searchQuery: string;
  watchlist: string[];
  fetchCoins: () => Promise<void>;
  fetchCoinDetails: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  setSearch: (query: string) => void;
  toggleWatchlist: (id: string) => void;
  clearError: () => void;
}

/**
 * Primary entry point for consuming crypto data in components. Wraps the
 * Zustand store and its selectors so UI code depends on a single, stable
 * surface rather than reaching into the store directly.
 *
 * Each value is selected individually so components only re-render when the
 * slice they actually use changes.
 */
export function useCrypto(): UseCryptoResult {
  const coins = useCryptoStore((state) => state.coins);
  const visibleCoins = useCryptoStore(selectVisibleCoins);
  const watchlistedCoins = useCryptoStore(selectWatchlistedCoins);
  const selectedCoin = useCryptoStore((state) => state.selectedCoin);
  const loading = useCryptoStore((state) => state.loading);
  const detailsLoading = useCryptoStore((state) => state.detailsLoading);
  const error = useCryptoStore((state) => state.error);
  const lastUpdated = useCryptoStore((state) => state.lastUpdated);
  const searchQuery = useCryptoStore((state) => state.searchQuery);
  const watchlist = useCryptoStore((state) => state.watchlist);

  const fetchCoins = useCryptoStore((state) => state.fetchCoins);
  const fetchCoinDetails = useCryptoStore((state) => state.fetchCoinDetails);
  const refresh = useCryptoStore((state) => state.refresh);
  const setSearch = useCryptoStore((state) => state.setSearch);
  const toggleWatchlist = useCryptoStore((state) => state.toggleWatchlist);
  const clearError = useCryptoStore((state) => state.clearError);

  return {
    coins,
    visibleCoins,
    watchlistedCoins,
    selectedCoin,
    loading,
    detailsLoading,
    error,
    lastUpdated,
    searchQuery,
    watchlist,
    fetchCoins,
    fetchCoinDetails,
    refresh,
    setSearch,
    toggleWatchlist,
    clearError,
  };
}
