export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Cancel a pending invocation, if any. */
  cancel: () => void;
}

/**
 * Return a debounced version of `fn` that delays invocation until `delayMs`
 * has elapsed since the last call. Useful for search input where we must not
 * react on every keystroke.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): DebouncedFunction<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delayMs);
  };

  const cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return Object.assign(debounced, { cancel });
}
