import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { LoadingSkeleton } from '@/components/ui';

import type { CoinDetail } from '../types';

import { AssetDetail } from './AssetDetail';

interface AssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coin: CoinDetail | null;
  /** The coin the user requested; guards against showing stale detail data. */
  coinId: string | null;
  loading: boolean;
}

function DetailSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-5">
      <span className="sr-only">Loading asset details…</span>
      <LoadingSkeleton className="h-9 w-40" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 8 }, (_, index) => (
          <LoadingSkeleton key={index} className="h-[68px] w-full" />
        ))}
      </div>
      <LoadingSkeleton className="h-14 w-full" />
    </div>
  );
}

/** Animated, lazy-loaded coin detail modal built on Radix Dialog. */
export function AssetModal({
  open,
  onOpenChange,
  coin,
  coinId,
  loading,
}: AssetModalProps) {
  // Only treat data as ready when it matches the requested coin and no fetch
  // is in flight — prevents flashing stale detail from a previous selection.
  const detail = !loading && coin?.id === coinId ? coin : null;
  const failed = !loading && detail === null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {detail ? (
                      <img
                        src={detail.image.large}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full"
                      />
                    ) : null}
                    <div className="flex flex-col">
                      <Dialog.Title className="text-lg leading-tight font-semibold text-slate-900 dark:text-slate-100">
                        {detail ? detail.name : 'Asset details'}
                      </Dialog.Title>
                      {detail ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          <span className="uppercase">{detail.symbol}</span> ·
                          Rank #{detail.market_cap_rank}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Dialog.Close
                    aria-label="Close details"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </Dialog.Close>
                </div>

                <Dialog.Description className="sr-only">
                  Detailed market information for the selected asset.
                </Dialog.Description>

                {detail ? (
                  <AssetDetail coin={detail} />
                ) : failed ? (
                  <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    We couldn&apos;t load the details for this asset. Please
                    close and try again.
                  </p>
                ) : (
                  <DetailSkeleton />
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
