import { motion } from 'framer-motion';
import { memo } from 'react';

import { AssetCard } from './AssetCard';
import { AssetTable } from './AssetTable';
import type { AssetCollectionProps } from './asset.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

/**
 * Responsive coin list: a table on md+ screens, stacked cards on small
 * screens. Both share the same data and handlers.
 */
function AssetListComponent({
  coins,
  watchlist,
  query,
  onToggleWatchlist,
  onSelect,
}: AssetCollectionProps) {
  const watchlistIds = new Set(watchlist);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900"
      >
        <AssetTable
          coins={coins}
          watchlist={watchlist}
          query={query}
          onToggleWatchlist={onToggleWatchlist}
          onSelect={onSelect}
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden"
      >
        {coins.map((coin) => (
          <AssetCard
            key={coin.id}
            coin={coin}
            isWatchlisted={watchlistIds.has(coin.id)}
            query={query}
            onToggle={onToggleWatchlist}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </>
  );
}

export const AssetList = memo(AssetListComponent);
