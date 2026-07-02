import { WifiOff } from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { TOAST_MESSAGES } from '@/constants';
import { useOnlineStatus } from '@/hooks';
import { useCryptoStore } from '@/store';

/**
 * Headless component that turns store/connectivity transitions into toasts.
 * Centralising this here keeps individual components free of notification
 * side effects.
 */
export function AppFeedback() {
  const { offline } = useOnlineStatus();
  const error = useCryptoStore((state) => state.error);

  const wasOffline = useRef(offline);
  const prevError = useRef(error);

  useEffect(() => {
    if (offline === wasOffline.current) return;
    if (offline) {
      toast(TOAST_MESSAGES.offline, {
        id: 'connectivity',
        icon: <WifiOff className="h-4 w-4 text-amber-500" aria-hidden />,
      });
    } else {
      toast.success(TOAST_MESSAGES.backOnline, { id: 'connectivity' });
    }
    wasOffline.current = offline;
  }, [offline]);

  useEffect(() => {
    if (error && error !== prevError.current) {
      toast.error(error.message, { id: 'api-error' });
    }
    prevError.current = error;
  }, [error]);

  return null;
}
