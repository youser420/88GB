import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const baseButton =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40';

/** Numbered pagination control with previous/next arrows. */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const goTo = (page: number): void => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
        className={cn(
          baseButton,
          'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => goTo(page)}
            className={cn(
              baseButton,
              isActive
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
        className={cn(
          baseButton,
          'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
