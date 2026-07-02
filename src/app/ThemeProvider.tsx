import { useEffect } from 'react';

import { DARK_MODE_CLASS, THEME } from '@/constants';
import { useThemeStore } from '@/store';
import type { WithChildren } from '@/types';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches
  );
}

/**
 * Applies the active theme by toggling the `.dark` class on the document root.
 * Honours the system preference when the user has selected "system" and reacts
 * live to OS-level changes — all without a page reload.
 */
export function ThemeProvider({ children }: WithChildren) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (): void => {
      const isDark =
        theme === THEME.DARK || (theme === THEME.SYSTEM && prefersDark());
      root.classList.toggle(DARK_MODE_CLASS, isDark);
    };

    apply();

    if (theme !== THEME.SYSTEM) return;

    // Follow OS changes while in "system" mode.
    const media = window.matchMedia(MEDIA_QUERY);
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  return children;
}
