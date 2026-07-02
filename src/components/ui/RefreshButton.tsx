import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

import { useRefresh } from '@/features/crypto';
import { cn } from '@/utils';

/**
 * Triggers a manual data refresh. Disabled while a request is in flight; the
 * icon spins during the fetch and a success toast confirms completion.
 */
export function RefreshButton() {
  const { refresh, isRefreshing } = useRefresh();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={() => void refresh()}
      disabled={isRefreshing}
      aria-label="Refresh market data"
      aria-busy={isRefreshing}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <RefreshCw
        className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
        aria-hidden
      />
      <span className="hidden sm:inline">
        {isRefreshing ? 'Refreshing…' : 'Refresh'}
      </span>
    </motion.button>
  );
}
