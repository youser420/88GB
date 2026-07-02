/**
 * Map a 24h percentage change to a Tailwind text-color class.
 * Centralised so rows and cards render gains/losses identically.
 */
export function getChangeColorClass(value: number): string {
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-slate-500 dark:text-slate-400';
}
