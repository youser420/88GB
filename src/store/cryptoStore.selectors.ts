import { MOVERS_LIST_SIZE } from '@/constants';
import type { Coin } from '@/features/crypto/types';
import { memoize } from '@/utils';

import type { CryptoStore } from './cryptoStore';

/**
 * Selectors derive view-ready data from raw store state. Filtering and sorting
 * live here (not in the store or the UI) so the store stays a plain data
 * container and components stay declarative.
 *
 * Each derivation is memoised on its inputs so that consuming components with
 * `useCryptoStore(selector)` receive a stable reference and avoid needless
 * re-renders.
 */

const computeFiltered = memoize((coins: Coin[], query: string): Coin[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return coins;
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(normalized) ||
      coin.symbol.toLowerCase().includes(normalized),
  );
});

const computeWatchlisted = memoize(
  (coins: Coin[], watchlist: string[]): Coin[] => {
    if (watchlist.length === 0) return [];
    const ids = new Set(watchlist);
    return coins.filter((coin) => ids.has(coin.id));
  },
);

const computeTopGainers = memoize((coins: Coin[]): Coin[] =>
  [...coins]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    .slice(0, MOVERS_LIST_SIZE),
);

const computeTopLosers = memoize((coins: Coin[]): Coin[] =>
  [...coins]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
    )
    .slice(0, MOVERS_LIST_SIZE),
);

/** Coins visible after applying the active search query. */
export const selectVisibleCoins = (state: CryptoStore): Coin[] =>
  computeFiltered(state.coins, state.searchQuery);

/** Alias of {@link selectVisibleCoins} for search-oriented call sites. */
export const selectFilteredCoins = selectVisibleCoins;

/** Coins the user has added to their watchlist. */
export const selectWatchlistedCoins = (state: CryptoStore): Coin[] =>
  computeWatchlisted(state.coins, state.watchlist);

/** Best 24h performers. */
export const selectTopGainers = (state: CryptoStore): Coin[] =>
  computeTopGainers(state.coins);

/** Worst 24h performers. */
export const selectTopLosers = (state: CryptoStore): Coin[] =>
  computeTopLosers(state.coins);

/** Grouped export for ergonomic access. */
export const cryptoSelectors = {
  visibleCoins: selectVisibleCoins,
  filteredCoins: selectFilteredCoins,
  watchlistedCoins: selectWatchlistedCoins,
  topGainers: selectTopGainers,
  topLosers: selectTopLosers,
} as const;
