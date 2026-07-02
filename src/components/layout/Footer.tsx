import { APP_VERSION } from '@/constants';

const currentYear = new Date().getFullYear();

/** Application footer: attribution, tech stack, version and year. */
export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container-responsive flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row dark:text-slate-400">
        <p>
          Powered by{' '}
          <a
            href="https://www.coingecko.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            CoinGecko
          </a>
          {' · '}Built with React &amp; TypeScript
        </p>
        <p>
          v{APP_VERSION} · © {currentYear}
        </p>
      </div>
    </footer>
  );
}
