/** Supported theme preferences. */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

/** CSS class toggled on the document root to activate dark mode. */
export const DARK_MODE_CLASS = 'dark';
