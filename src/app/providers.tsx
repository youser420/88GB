import { Toaster } from 'react-hot-toast';

import type { WithChildren } from '@/types';

import { AppFeedback } from './AppFeedback';
import { ThemeProvider } from './ThemeProvider';

/**
 * Composes all app-wide providers in one place so `App` stays declarative.
 * New providers (state, data fetching, etc.) are added here as needed.
 */
export function AppProviders({ children }: WithChildren) {
  return (
    <ThemeProvider>
      {children}
      <AppFeedback />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          className:
            'rounded-lg border border-slate-200 text-sm shadow-lg dark:border-slate-700',
        }}
      />
    </ThemeProvider>
  );
}
