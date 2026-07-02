import { cn } from '@/utils';

export type DashboardView = 'all' | 'watchlist';

const VIEWS: ReadonlyArray<{ id: DashboardView; label: string }> = [
  { id: 'all', label: 'All Coins' },
  { id: 'watchlist', label: 'Watchlist' },
];

interface ViewToggleProps {
  value: DashboardView;
  onChange: (view: DashboardView) => void;
}

/** Segmented control switching between the full list and the watchlist. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Filter coins"
      className="inline-flex overflow-hidden rounded-md border border-slate-200 dark:border-slate-800"
    >
      {VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          aria-pressed={value === view.id}
          onClick={() => onChange(view.id)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
            value === view.id
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
