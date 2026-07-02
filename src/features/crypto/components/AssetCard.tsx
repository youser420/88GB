import { motion } from 'framer-motion';
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

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

/** Mobile card presentation for a single coin. */
function AssetCardComponent({
  coin,
  isWatchlisted,
  query,
  onToggle,
  onSelect,
}: AssetItemProps) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="flex min-h-[76px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        type="button"
        onClick={() => onSelect(coin.id)}
        className="flex flex-1 items-center gap-3 rounded-md text-left focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      >
        <img
          src={coin.image}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          className="h-9 w-9 shrink-0 rounded-full"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-slate-900 dark:text-slate-100">
              <HighlightText text={coin.name} query={query} />
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
              {coin.symbol}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">
              {formatCurrency(coin.current_price)}
            </span>
            <span
              className={`tabular-nums ${getChangeColorClass(coin.price_change_percentage_24h)}`}
            >
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>
        </div>
      </button>

      <div className="flex flex-col items-end gap-1.5">
        <WatchlistButton
          active={isWatchlisted}
          coinName={coin.name}
          onToggle={() => onToggle(coin.id)}
        />
        <span className="text-xs whitespace-nowrap text-slate-500 dark:text-slate-400">
          {formatCompactCurrency(coin.market_cap)}
        </span>
      </div>
    </motion.article>
  );
}

/**
 * Memoised so a watchlist toggle only re-renders the affected card. Kept a
 * `motion` component to preserve the staggered entrance from its parent.
 */
export const AssetCard = memo(AssetCardComponent);
