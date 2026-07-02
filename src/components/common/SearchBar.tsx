import { Search } from 'lucide-react';

import { useCryptoStore } from '@/store';

/**
 * Search input bound to the store. Typing updates `searchQuery`; filtering is
 * performed by selectors, so no API call is made per keystroke.
 */
export function SearchBar() {
  const searchQuery = useCryptoStore((state) => state.searchQuery);
  const setSearch = useCryptoStore((state) => state.setSearch);

  return (
    <div className="relative w-full max-w-xs">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search assets…"
        aria-label="Search assets"
        className="h-9 w-full rounded-md border border-slate-200 bg-transparent pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:border-slate-800 dark:text-slate-200"
      />
    </div>
  );
}
