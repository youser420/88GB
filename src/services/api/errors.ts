import axios, { type AxiosError } from 'axios';

import type { ApiErrorResponse } from '@/features/crypto/types';

/**
 * Discriminant used to branch on error type without relying on `instanceof`
 * (handy across module/realm boundaries and in tests).
 */
export const ERROR_KIND = {
  API: 'API',
  NETWORK: 'NETWORK',
  RATE_LIMIT: 'RATE_LIMIT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorKind = (typeof ERROR_KIND)[keyof typeof ERROR_KIND];

/** Base class for every error surfaced by the data layer. */
export abstract class BaseError extends Error {
  abstract readonly kind: ErrorKind;

  protected constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
    // Restore the prototype chain broken when extending built-ins.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** A well-formed HTTP error response (4xx/5xx) from the API. */
export class ApiError extends BaseError {
  readonly kind: ErrorKind = ERROR_KIND.API;
  readonly status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

/** No response was received (offline, DNS failure, timeout, CORS, etc.). */
export class NetworkError extends BaseError {
  readonly kind: ErrorKind = ERROR_KIND.NETWORK;

  constructor(
    message = 'Network unavailable. Please check your connection.',
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

/** The API rejected the request due to rate limiting (HTTP 429). */
export class RateLimitError extends ApiError {
  override readonly kind: ErrorKind = ERROR_KIND.RATE_LIMIT;
  /** Seconds to wait before retrying, when advertised by the server. */
  readonly retryAfter: number | undefined;

  constructor(
    message = 'Too many requests. Please slow down and try again shortly.',
    retryAfter?: number,
    options?: ErrorOptions,
  ) {
    super(message, 429, options);
    this.retryAfter = retryAfter;
  }
}

/** Fallback for anything we could not classify. */
export class UnknownError extends BaseError {
  readonly kind: ErrorKind = ERROR_KIND.UNKNOWN;

  constructor(
    message = 'An unexpected error occurred.',
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

/** Extract the most useful human-readable message from an API error payload. */
function extractApiMessage(error: AxiosError): string {
  // The response body is untyped JSON; narrow it at this single boundary.
  const data = error.response?.data as ApiErrorResponse | undefined;
  return (
    data?.status?.error_message ??
    data?.error ??
    error.message ??
    'Request failed'
  );
}

function parseRetryAfter(error: AxiosError): number | undefined {
  const header: unknown = error.response?.headers['retry-after'];
  if (typeof header !== 'string') return undefined;
  const seconds = Number.parseInt(header, 10);
  return Number.isNaN(seconds) ? undefined : seconds;
}

/** Convert an Axios error into one of our typed domain errors. */
function fromAxiosError(error: AxiosError): BaseError {
  // No response object => the request never completed (offline/timeout/etc.).
  if (!error.response) {
    return new NetworkError(undefined, { cause: error });
  }

  const message = extractApiMessage(error);
  const { status } = error.response;

  if (status === 429) {
    return new RateLimitError(message, parseRetryAfter(error), {
      cause: error,
    });
  }

  return new ApiError(message, status, { cause: error });
}

/**
 * Normalise any thrown value into a {@link BaseError}. This is the single
 * choke point that guarantees raw Axios errors never leak out of the data
 * layer.
 */
export function toAppError(error: unknown): BaseError {
  if (error instanceof BaseError) return error;
  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }
  return new UnknownError(undefined, { cause: error });
}
