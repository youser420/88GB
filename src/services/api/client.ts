import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import {
  API_BASE_URL,
  API_RETRY,
  API_TIMEOUT_MS,
  DEFAULT_HEADERS,
} from '@/constants';
import { sleep } from '@/utils';

import { toAppError } from './errors';

/**
 * Provider that supplies an auth token when the app grows authentication.
 * Kept as an injectable hook so the client stays decoupled from any auth
 * store. Returns `null` when there is no active session.
 */
type AuthTokenProvider = () => string | null;

let authTokenProvider: AuthTokenProvider | null = null;

/** Register how the client should obtain an auth token (future use). */
export function setAuthTokenProvider(provider: AuthTokenProvider | null): void {
  authTokenProvider = provider;
}

function attachAuthHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = authTokenProvider?.();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

// Retry attempts are tracked per request config object, avoiding any need to
// augment Axios' config type with bookkeeping fields.
const retryCounts = new WeakMap<InternalAxiosRequestConfig, number>();

/**
 * Decide whether a failed request is worth retrying. We only retry idempotent
 * GET requests that failed for a transient reason (no response / timeout, a
 * 5xx server error, or a 429 rate limit) and haven't exhausted their budget.
 */
function shouldRetry(
  error: AxiosError,
  config: InternalAxiosRequestConfig,
  attempts: number,
): boolean {
  if ((config.method ?? 'get').toLowerCase() !== 'get') return false;
  if (attempts >= API_RETRY.MAX_ATTEMPTS) return false;

  // If the browser reports it is offline, fail fast rather than burning the
  // whole retry budget on requests that cannot possibly succeed.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }

  const status = error.response?.status;
  if (status === undefined) return true; // network error / timeout
  return status === 429 || status >= 500;
}

/**
 * Backoff for the next attempt: honour a server-provided `Retry-After` header
 * (429), otherwise use exponential backoff with jitter, always capped.
 */
function backoffDelayMs(attempt: number, error: AxiosError): number {
  const retryAfter: unknown = error.response?.headers['retry-after'];
  if (typeof retryAfter === 'string') {
    const seconds = Number.parseInt(retryAfter, 10);
    if (!Number.isNaN(seconds)) {
      return Math.min(seconds * 1000, API_RETRY.MAX_DELAY_MS);
    }
  }
  const exponential = API_RETRY.BASE_DELAY_MS * 2 ** (attempt - 1);
  const jitter = Math.random() * API_RETRY.BASE_DELAY_MS;
  return Math.min(exponential + jitter, API_RETRY.MAX_DELAY_MS);
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    headers: { ...DEFAULT_HEADERS },
  });

  // Request pipeline: inject auth when available.
  instance.interceptors.request.use(attachAuthHeader);

  // Response pipeline: pass success through; retry transient failures with
  // backoff, then normalise anything that still fails so raw Axios errors
  // never escape the data layer.
  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (axios.isAxiosError(error) && error.config) {
        const { config } = error;
        const attempts = retryCounts.get(config) ?? 0;
        if (shouldRetry(error, config, attempts)) {
          const nextAttempt = attempts + 1;
          retryCounts.set(config, nextAttempt);
          await sleep(backoffDelayMs(nextAttempt, error));
          return instance.request(config);
        }
        retryCounts.delete(config);
      }
      return Promise.reject(toAppError(error));
    },
  );

  return instance;
}

/**
 * Shared Axios instance. This is the ONLY place axios is instantiated;
 * no component or store should import axios directly.
 */
export const apiClient = createApiClient();
