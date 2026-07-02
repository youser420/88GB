import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { cn } from '@/utils';

interface WatchlistButtonProps {
  active: boolean;
  coinName: string;
  onToggle: () => void;
}

/**
 * Star toggle used by both rows and cards. Stops click propagation so
 * toggling never triggers the parent's "open details" behaviour. The star
 * pops when its state changes.
 */
export function WatchlistButton({
  active,
  coinName,
  onToggle,
}: WatchlistButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${coinName} from watchlist`
          : `Add ${coinName} to watchlist`
      }
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:bg-slate-800"
    >
      <motion.span
        key={String(active)}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 16 }}
      >
        <Star
          className={cn(
            'h-4 w-4 transition-colors',
            active
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-400 dark:text-slate-500',
          )}
          aria-hidden
        />
      </motion.span>
    </motion.button>
  );
}
