/**
 * Minimal generic in-memory cache with per-entry expiry.
 *
 * Two read modes are provided:
 *  - `get`      → returns a value only while it is still fresh.
 *  - `getStale` → returns the value regardless of expiry (used for the
 *                 offline / error fallback path).
 *
 * `now` is injectable so time-dependent behaviour is trivial to test.
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface TtlCache<T> {
  get(key: string): T | undefined;
  getStale(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
}

export function createTtlCache<T>(
  ttlMs: number,
  now: () => number = Date.now,
): TtlCache<T> {
  const store = new Map<string, CacheEntry<T>>();

  const get = (key: string): T | undefined => {
    const entry = store.get(key);
    if (!entry) return undefined;
    return now() <= entry.expiresAt ? entry.value : undefined;
  };

  return {
    get,
    getStale: (key) => store.get(key)?.value,
    set: (key, value) => {
      store.set(key, { value, expiresAt: now() + ttlMs });
    },
    has: (key) => get(key) !== undefined,
    delete: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}
