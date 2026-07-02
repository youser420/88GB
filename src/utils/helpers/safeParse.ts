/** Discriminated result of a parse attempt — never throws. */
export type SafeParseResult<T> =
  { success: true; data: T } | { success: false; error: Error };

/**
 * Parse a JSON string without throwing. Callers must narrow on `success`
 * before touching `data`, keeping deserialization type-safe.
 */
export function safeParse<T>(value: string): SafeParseResult<T> {
  try {
    return { success: true, data: JSON.parse(value) as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to parse JSON'),
    };
  }
}
