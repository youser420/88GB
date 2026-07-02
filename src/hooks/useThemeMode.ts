import { useEffect, useState } from 'react';

import { THEME, type Theme } from '@/constants';
import { useThemeStore } from '@/store';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches
  );
}

export interface ThemeMode {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/**
 * Resolves the effective light/dark mode from the stored preference and the
 * live system setting, and exposes helpers to change it.
 */
export function useThemeMode(): ThemeMode {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [systemDark, setSystemDark] = useState(prefersDark);

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY);
    const handler = (): void => setSystemDark(media.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const isDark = theme === THEME.DARK || (theme === THEME.SYSTEM && systemDark);
  const toggle = (): void => setTheme(isDark ? THEME.LIGHT : THEME.DARK);

  return { theme, isDark, setTheme, toggle };
}
