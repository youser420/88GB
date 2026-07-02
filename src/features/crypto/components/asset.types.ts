import type { Coin } from '../types';

/**
 * Props shared by a single asset presentation (row or card).
 *
 * Handlers take the coin id (rather than pre-bound closures) so the parent can
 * pass stable references, keeping the memoised item components from re-rendering
 * when unrelated rows change.
 */
export interface AssetItemProps {
  coin: Coin;
  isWatchlisted: boolean;
  /** Active search query, used to highlight matching text. */
  query: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

/** Props shared by asset collections (table / responsive list). */
export interface AssetCollectionProps {
  coins: Coin[];
  watchlist: string[];
  query: string;
  onToggleWatchlist: (id: string) => void;
  onSelect: (id: string) => void;
}
