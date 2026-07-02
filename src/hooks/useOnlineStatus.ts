import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

// Assume connectivity during SSR / non-browser environments.
function getServerSnapshot(): boolean {
  return true;
}

export interface OnlineStatus {
  online: boolean;
  offline: boolean;
}

/**
 * Subscribe to the browser's connectivity state. Backed by
 * `useSyncExternalStore` for tear-free, concurrent-safe reads.
 */
export function useOnlineStatus(): OnlineStatus {
  const online = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { online, offline: !online };
}
