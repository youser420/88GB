import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS, THEME, type Theme } from '@/constants';

interface ThemeState {
  /** User preference: an explicit theme or "follow system". */
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** Convenience toggle between light and dark. */
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: THEME.SYSTEM,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === THEME.DARK ? THEME.LIGHT : THEME.DARK }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
