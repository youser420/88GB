import { Activity } from 'lucide-react';

import { SearchBar } from '@/components/common';
import { RefreshButton, ThemeToggle } from '@/components/ui';
import { APP_NAME } from '@/constants';
import { useScrolled } from '@/hooks';
import { useCryptoStore } from '@/store';
import { cn, formatDate } from '@/utils';

/**
 * Sticky top navigation. Gains a subtle shadow once the page scrolls, and
 * drops the search field to a second row on small screens.
 */
export function Navbar() {
  const scrolled = useScrolled();
  const lastUpdated = useCryptoStore((state) => state.lastUpdated);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-shadow dark:border-slate-800 dark:bg-slate-950/80',
        scrolled && 'shadow-sm',
      )}
    >
      <div className="container-responsive flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
            <Activity className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated ? (
            <span className="hidden text-xs text-slate-500 lg:inline dark:text-slate-400">
              Updated {formatDate(lastUpdated, 'h:mm A')}
            </span>
          ) : null}
          <RefreshButton />
          <ThemeToggle />
        </div>
      </div>

      <div className="container-responsive pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
