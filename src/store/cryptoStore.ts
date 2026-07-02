import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants';
import {
  coinGeckoService,
  clearCryptoCaches,
} from '@/features/crypto/services';
import type { Coin, CoinDetail } from '@/features/crypto/types';
import { ApiError, type ErrorKind, toAppError } from '@/services';

/** UI-friendly, serialisable representation of a data-layer error. */
export interface CryptoErrorInfo {
  message: string;
  kind: ErrorKind;
  status?: number;
}

/** Reactive state managed by the store. */
interface CryptoState {
  coins: Coin[];
  selectedCoin: CoinDetail | null;
  /** Loading flag for the top-coins list. */
  loading: boolean;
  /** Separate flag for the detail modal so it never drives list/refresh UI. */
  detailsLoading: boolean;
  error: CryptoErrorInfo | null;
  lastUpdated: number | null;
  searchQuery: string;
  watchlist: string[];
}

/** Imperative actions exposed by the store. */
interface CryptoActions {
  fetchCoins: () => Promise<void>;
  fetchCoinDetails: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  setSearch: (query: string) => void;
  toggleWatchlist: (id: string) => void;
  clearError: () => void;
}

export type CryptoStore = CryptoState & CryptoActions;

const initialState: CryptoState = {
  coins: [],
  selectedCoin: null,
  loading: false,
  detailsLoading: false,
  error: null,
  lastUpdated: null,
  searchQuery: '',
  watchlist: [],
};

/** Normalise any thrown value into serialisable error info for the UI. */
function toErrorInfo(error: unknown): CryptoErrorInfo {
  const appError = toAppError(error);
  const info: CryptoErrorInfo = {
    message: appError.message,
    kind: appError.kind,
  };
  if (appError instanceof ApiError) {
    return { ...info, status: appError.status };
  }
  return info;
}

export const useCryptoStore = create<CryptoStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCoins: async () => {
        set({ loading: true, error: null });
        try {
          const coins = await coinGeckoService.getTopCoins();
          set({ coins, lastUpdated: Date.now(), loading: false });
        } catch (error) {
          set({ error: toErrorInfo(error), loading: false });
        }
      },

      fetchCoinDetails: async (id) => {
        set({ detailsLoading: true, error: null });
        try {
          const selectedCoin = await coinGeckoService.getCoinDetails(id);
          set({ selectedCoin, detailsLoading: false });
        } catch (error) {
          set({ error: toErrorInfo(error), detailsLoading: false });
        }
      },

      // Manual refresh bypasses the cache so users always get live data.
      refresh: async () => {
        clearCryptoCaches();
        await get().fetchCoins();
      },

      // Search only updates state; filtering is performed by selectors so we
      // never hit the API on every keystroke.
      setSearch: (query) => {
        set({ searchQuery: query });
      },

      toggleWatchlist: (id) => {
        const { watchlist } = get();
        const next = watchlist.includes(id)
          ? watchlist.filter((entry) => entry !== id)
          : [...watchlist, id];
        set({ watchlist: next });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STORAGE_KEYS.CRYPTO_STORE,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist ONLY the watchlist; volatile/network state is never persisted.
      partialize: (state) => ({ watchlist: state.watchlist }),
    },
  ),
);
