import { memo } from 'react';

import { HighlightText } from '@/components/common';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercentage,
} from '@/utils';

import { getChangeColorClass } from '../utils';

import type { AssetItemProps } from './asset.types';
import { WatchlistButton } from './WatchlistButton';

/** A single desktop table row for one coin. Clicking opens the detail modal. */
function AssetRowComponent({
  coin,
  isWatchlisted,
  query,
  onToggle,
  onSelect,
}: AssetItemProps) {
  return (
    <tr
      onClick={() => onSelect(coin.id)}
      className="cursor-pointer transition-colors even:bg-slate-50/60 hover:bg-brand-50/60 dark:even:bg-slate-800/30 dark:hover:bg-slate-800/70"
    >
      <td className="px-4 py-3.5 text-sm text-slate-500 tabular-nums dark:text-slate-400">
        {coin.market_cap_rank}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            className="h-7 w-7 shrink-0 rounded-full"
          />
          <button
            type="button"
            onClick={(event) => {
              // The row itself is clickable; avoid firing onSelect twice.
              event.stopPropagation();
              onSelect(coin.id);
            }}
            className="rounded font-medium text-slate-900 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-slate-100"
          >
            <HighlightText text={coin.name} query={query} />
          </button>
          <span className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
            {coin.symbol}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100">
        {formatCurrency(coin.current_price)}
      </td>
      <td
        className={`px-4 py-3.5 text-right text-sm font-medium tabular-nums ${getChangeColorClass(coin.price_change_percentage_24h)}`}
      >
        {formatPercentage(coin.price_change_percentage_24h)}
      </td>
      <td className="px-4 py-3.5 text-right text-sm tabular-nums text-slate-600 dark:text-slate-300">
        {formatCompactCurrency(coin.market_cap)}
      </td>
      <td className="px-4 py-3.5 text-right">
        <WatchlistButton
          active={isWatchlisted}
          coinName={coin.name}
          onToggle={() => onToggle(coin.id)}
        />
      </td>
    </tr>
  );
}

/**
 * Memoised so toggling one coin's watchlist state (or hovering elsewhere) only
 * re-renders the affected row, not the whole table.
 */
export const AssetRow = memo(AssetRowComponent);
