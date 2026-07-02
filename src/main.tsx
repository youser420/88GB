import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app';
import { useCryptoStore } from '@/store';
import '@/styles/globals.css';

// Expose the store on `window` in development for quick manual inspection
// (e.g. `cryptoStore.getState().fetchCoins()` from the browser console).
if (import.meta.env.DEV) {
  (window as Window & { cryptoStore?: typeof useCryptoStore }).cryptoStore =
    useCryptoStore;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element "#root" was not found in the document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
