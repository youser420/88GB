import { clsx, type ClassValue } from 'clsx';

/**
 * Merge conditional class names into a single string.
 * Thin wrapper around `clsx` so styling stays consistent across the app.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
