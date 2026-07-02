import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Optional API status code to surface (e.g. 429, 503). */
  status?: number | undefined;
  icon?: ReactNode;
  onRetry?: () => void;
}

/** Friendly error panel with an optional retry action and status badge. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load market data right now.',
  status,
  icon,
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-800"
    >
      {icon ?? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden />
        </span>
      )}
      <div className="space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
        {status !== undefined ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            API status: {status}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="inline-flex h-9 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        >
          Try again
        </motion.button>
      ) : null}
    </motion.div>
  );
}
