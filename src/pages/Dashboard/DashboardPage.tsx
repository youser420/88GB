import { motion } from 'framer-motion';
import { SearchX, Star, WifiOff } from 'lucide-react';
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';

import { EmptyState, ErrorState, Pagination } from '@/components/common';
import { LoadingSkeleton } from '@/components/ui';
import { DASHBOARD_PAGE_SIZE, TOAST_MESSAGES } from '@/constants';
import { AssetList, useCrypto, useRefresh } from '@/features/crypto';
import { ERROR_KIND } from '@/services';
import { useCryptoStore } from '@/store';

import { ViewToggle, type DashboardView } from './ViewToggle';

// Lazily loaded so the modal (and its deps) ship in a separate chunk.
const AssetModal = lazy(() =>
  import('@/features/crypto/components/AssetModal').then((module) => ({
    default: module.AssetModal,
  })),
);

/**
 * Loading placeholder that mirrors the real list layout (table on md+, card
 * grid below) at the exact page size, plus a reserved pagination slot. Keeping
 * the shape identical to the loaded content minimises layout shift (CLS).
 */
function DashboardSkeleton() {
  const rows = Array.from({ length: DASHBOARD_PAGE_SIZE });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="status"
      aria-live="polite"
      className="flex flex-col gap-4"
    >
      <span className="sr-only">Loading market data…</span>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <LoadingSkeleton className="h-3 w-5" />
          <LoadingSkeleton className="h-3 w-24" />
          <LoadingSkeleton className="ml-auto h-3 w-16" />
        </div>
        {rows.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0 dark:border-slate-800/60"
          >
            <LoadingSkeleton className="h-4 w-5" />
            <LoadingSkeleton className="h-7 w-7 rounded-full" />
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="ml-auto h-4 w-20" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {rows.map((_, index) => (
          <div
            key={index}
            className="flex min-h-[76px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-1 items-center gap-3">
              <LoadingSkeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <LoadingSkeleton className="h-3.5 w-24" />
                <LoadingSkeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <LoadingSkeleton className="h-8 w-8 rounded-md" />
              <LoadingSkeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <LoadingSkeleton className="h-9 w-56 rounded-md" />
      </div>
    </motion.div>
  );
}

/** Top-level dashboard view. Orchestrates data-layer state into UI pieces. */
export function DashboardPage() {
  const {
    visibleCoins,
    watchlistedCoins,
    watchlist,
    loading,
    detailsLoading,
    error,
    selectedCoin,
    searchQuery,
    fetchCoins,
    fetchCoinDetails,
  } = useCrypto();
  const { refresh } = useRefresh();

  const [view, setView] = useState<DashboardView>('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalRequested, setModalRequested] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    void fetchCoins();
  }, [fetchCoins]);

  // Reset to the first page when the active filter changes (render-time
  // pattern avoids an extra effect + cascading render).
  const filterKey = `${view}:${searchQuery}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const openDetails = useCallback(
    (id: string): void => {
      setSelectedId(id);
      setModalRequested(true);
      setModalOpen(true);
      void fetchCoinDetails(id);
    },
    [fetchCoinDetails],
  );

  // Reads live state so the callback stays referentially stable.
  const handleToggleWatchlist = useCallback((id: string): void => {
    const state = useCryptoStore.getState();
    const wasWatchlisted = state.watchlist.includes(id);
    const name = state.coins.find((coin) => coin.id === id)?.name ?? 'Asset';
    state.toggleWatchlist(id);
    if (wasWatchlisted) {
      toast(TOAST_MESSAGES.watchlistRemoved(name), {
        icon: <Star className="h-4 w-4 text-slate-400" aria-hidden />,
      });
    } else {
      toast.success(TOAST_MESSAGES.watchlistAdded(name), {
        icon: (
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
        ),
      });
    }
  }, []);

  const list = view === 'all' ? visibleCoins : watchlistedCoins;
  const totalPages = Math.max(1, Math.ceil(list.length / DASHBOARD_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = list.slice(
    (currentPage - 1) * DASHBOARD_PAGE_SIZE,
    currentPage * DASHBOARD_PAGE_SIZE,
  );
  const showInitialLoading = loading && visibleCoins.length === 0;

  let content: ReactNode;
  if (error) {
    const isOffline = error.kind === ERROR_KIND.NETWORK;
    content = (
      <ErrorState
        title={isOffline ? 'You appear to be offline' : 'Unable to load data'}
        description={error.message}
        status={error.status}
        icon={
          isOffline ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
              <WifiOff className="h-6 w-6 text-amber-500" aria-hidden />
            </span>
          ) : undefined
        }
        onRetry={() => void refresh({ isRetry: true })}
      />
    );
  } else if (showInitialLoading) {
    content = <DashboardSkeleton />;
  } else if (list.length === 0) {
    content =
      view === 'watchlist' ? (
        <EmptyState
          icon={<Star className="h-6 w-6" aria-hidden />}
          title="Your watchlist is empty"
          description="Tap the star on any asset to start tracking it."
        />
      ) : searchQuery ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" aria-hidden />}
          title="No assets found"
          description={`We couldn't find anything matching “${searchQuery}”.`}
        />
      ) : (
        <EmptyState title="No assets available" />
      );
  } else {
    content = (
      <div className="flex flex-col gap-4">
        <AssetList
          coins={pageItems}
          watchlist={watchlist}
          query={searchQuery}
          onToggleWatchlist={handleToggleWatchlist}
          onSelect={openDetails}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    );
  }

  const countLabel = buildCountLabel(view, searchQuery, list.length);

  return (
    <section
      aria-labelledby="dashboard-heading"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="dashboard-heading"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Market Overview
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {countLabel}
          </p>
        </div>
        <ViewToggle value={view} onChange={setView} />
      </header>

      {content}

      {modalRequested ? (
        <Suspense fallback={null}>
          <AssetModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            coin={selectedCoin}
            coinId={selectedId}
            loading={detailsLoading}
          />
        </Suspense>
      ) : null}
    </section>
  );
}

function buildCountLabel(
  view: DashboardView,
  searchQuery: string,
  count: number,
): string {
  const plural = count === 1 ? '' : 's';
  if (searchQuery) return `${count} result${plural} for “${searchQuery}”`;
  if (view === 'watchlist') return `${count} saved asset${plural}`;
  return `Tracking ${count} assets`;
}
