import { cn } from '@/utils';

interface LoadingSkeletonProps {
  /** Extra classes to size the skeleton (height/width/shape). */
  className?: string;
}

/**
 * A single shimmerless placeholder block. Purely presentational (hidden from
 * assistive tech) — compose several inside a container that carries a single
 * `role="status"` announcement so screen readers aren't spammed per block.
 */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded bg-slate-200 dark:bg-slate-800',
        className ?? 'h-4 w-full',
      )}
    />
  );
}
