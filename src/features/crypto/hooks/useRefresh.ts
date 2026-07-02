import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { TOAST_MESSAGES } from '@/constants';
import { useCryptoStore } from '@/store';

interface RefreshOptions {
  /** Whether this refresh originated from a retry (changes the success copy). */
  isRetry?: boolean;
}

export interface UseRefreshResult {
  refresh: (options?: RefreshOptions) => Promise<void>;
  isRefreshing: boolean;
}

/**
 * Wraps the store's `refresh` to add success toasts. Failures are announced
 * centrally by `AppFeedback`, so this only handles the happy path — keeping
 * notification logic out of the data layer and free of duplication.
 */
export function useRefresh(): UseRefreshResult {
  const refreshStore = useCryptoStore((state) => state.refresh);
  const isRefreshing = useCryptoStore((state) => state.loading);

  const refresh = useCallback(
    async (options?: RefreshOptions): Promise<void> => {
      await refreshStore();
      if (!useCryptoStore.getState().error) {
        toast.success(
          options?.isRetry
            ? TOAST_MESSAGES.retrySuccess
            : TOAST_MESSAGES.refreshComplete,
        );
      }
    },
    [refreshStore],
  );

  return { refresh, isRefreshing };
}
