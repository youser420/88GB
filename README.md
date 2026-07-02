# Crypto Market Pulse

A responsive, production-minded React dashboard for tracking the top cryptocurrencies. It lists live market data from the [CoinGecko API](https://www.coingecko.com/en/api), with search, a persistent watchlist, per-coin detail modals, dark mode, and graceful loading/error/offline handling.

## Features

- **Live market table** — top coins with rank, price, 24h change, and market cap.
- **Instant search** — client-side filtering with match highlighting (no request per keystroke).
- **Watchlist** — star coins to track them; persisted to `localStorage`.
- **Coin detail modal** — lazy-loaded, with 24h high/low, supply, ATH/ATL, and description.
- **Dark mode** — system-aware, persisted, and applied before first paint (no flash).
- **Resilient data layer** — in-memory TTL cache, offline fallback to cached data, and automatic retry with backoff for transient failures.
- **Accessible & responsive** — keyboard navigable, screen-reader friendly, and laid out for 320px → 1440px.

## Tech Stack

| Area | Choice | Why |
| --- | --- | --- |
| Framework | **React 19 + TypeScript** | Component model + end-to-end type safety (the codebase is `any`-free). |
| Build tool | **Vite** | Fast dev server/HMR and an optimized, chunk-split production build. |
| Styling | **TailwindCSS v4** | Utility-first styling with a tiny, consistent design system and class-based dark mode. |
| Routing | **React Router DOM** | Standard declarative routing; ready to grow beyond a single page. |
| State | **Zustand** | Minimal, hook-based global state with fine-grained selectors and simple `persist` middleware — far less boilerplate than Redux. |
| HTTP | **Axios** | Interceptors give a single choke point for auth, error normalization, and retry logic. |
| UI primitives | **Radix UI** | Accessible, unstyled primitives (the Dialog handles focus trap, ESC, and focus return for free). |
| Icons | **Lucide React** | Lightweight, tree-shakeable, consistent icon set. |
| Animation | **Framer Motion** | Declarative transitions restricted to opacity/transform, so animations never cause layout shift. |
| Notifications | **react-hot-toast** | Tiny, accessible toasts for refresh/watchlist/offline feedback. |
| Utilities | **clsx**, **dayjs** | Ergonomic conditional class names and small, reliable date formatting. |
| Tooling | **ESLint + Prettier** | Type-checked linting and consistent formatting enforced in CI-friendly scripts. |

## Getting Started

**Requirements:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`. No API key is required — CoinGecko's public endpoints are used.

To build and preview a production bundle:

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_COINGECKO_API_URL` | No | Base URL for the CoinGecko API. Defaults to `https://api.coingecko.com/api/v3` if unset. |

See `.env.example`. API configuration lives in `src/constants/api.ts`; there are no hardcoded URLs elsewhere.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run lint:fix` | Run ESLint and auto-fix issues. |
| `npm run format` | Format the codebase with Prettier. |
| `npm run format:check` | Check formatting without writing. |
| `npm run type-check` | Run the TypeScript compiler (no emit). |

## Architecture

The data layer is fully decoupled from the UI so it can be tested and mocked in isolation:

- `src/constants/api.ts` — base URL, endpoints, timeout, and retry policy.
- `src/services/api/` — shared Axios client (`client.ts`) with retry/backoff + interceptors, and a typed error hierarchy (`errors.ts`).
- `src/features/crypto/services/` — the CoinGecko service (`getTopCoins`, `getCoinDetails`, `searchCoins`) with TTL caching and offline fallback.
- `src/store/` — Zustand store + memoized selectors; only the watchlist is persisted.
- `src/features/crypto/` and `src/components/` — UI, which consumes the store via the `useCrypto` hook.

```text
src/
  app/            # App entry, providers, router
  components/
    common/       # Shared components (SearchBar, Pagination, states…)
    layout/       # Navbar, Footer
    ui/           # Low-level primitives (ThemeToggle, RefreshButton, Skeleton)
  features/
    crypto/       # Crypto feature: components, hooks, services, types, utils
  hooks/          # App-wide hooks
  layouts/        # Route layouts (DashboardLayout)
  pages/          # Dashboard, NotFound
  services/api/   # Shared HTTP client + error types
  store/          # Zustand stores + selectors
  utils/          # Formatters and helpers
  constants/      # App-wide constants
  styles/         # Global styles
```

## Trade-offs & Future Improvements

**Shortcuts taken (and why they're reasonable here):**

- **No automated tests.** The layers are structured to be testable (the store depends on a `CryptoService` interface, formatters/selectors are pure), but no Vitest/RTL suite ships yet. This was the biggest scope cut.
- **Client-side search only.** Search filters the already-fetched list rather than calling CoinGecko's `/search` endpoint. It's instant and free of rate-limit pressure, but only matches coins on the current fetch (top 50).
- **Fixed data set.** The dashboard fetches the top 50 coins and paginates client-side (10/page) instead of server-side pagination — simpler and snappier at this scale.
- **No API key / caching tier.** Uses CoinGecko's public API with an in-memory TTL cache. Under heavy use you may hit rate limits (handled gracefully with a `429` message + retry).
- **In-memory cache.** The cache resets on reload; only the watchlist is persisted.

**With more time I would add:**

- A **test suite** (Vitest + React Testing Library) plus mocked-service tests for the data layer, and axe/Playwright checks across breakpoints.
- **Server-driven search & pagination** to cover the full market, with a debounced request layer.
- **Auto-refresh** on an interval (constants already exist) with a visible "live" indicator.
- **web-vitals instrumentation** to track CLS/LCP/INP in production, and image optimization (`fetchpriority`, resized logos).
- **List virtualization** if page sizes grow well beyond 10 rows.
- **CI** running `type-check`, `lint`, `build`, and tests on every PR.
```
