import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

/** Neutral placeholder shown when a list resolves with no items. */
export function EmptyState({
  title = 'Nothing to show yet',
  description,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-800"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </p>
        {description ? (
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
