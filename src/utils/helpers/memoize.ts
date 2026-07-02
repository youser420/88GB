/**
 * Memoise a pure function on its most recent arguments (single-slot cache
 * with reference equality). Ideal for derived-state selectors where inputs
 * are stable object references between renders.
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  let cache: { args: Args; result: Result } | null = null;

  return (...args: Args): Result => {
    const isSame =
      cache !== null &&
      cache.args.length === args.length &&
      cache.args.every((arg, index) => Object.is(arg, args[index]));

    if (cache !== null && isSame) return cache.result;

    const result = fn(...args);
    cache = { args, result };
    return result;
  };
}
