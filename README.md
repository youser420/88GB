# Crypto Market Pulse

A production-ready React application foundation for a cryptocurrency market dashboard.

> This repository currently contains the project scaffolding only. Feature implementation (data fetching, state management, theming, search, etc.) is intentionally deferred.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** TailwindCSS (class-based dark mode)
- **Routing:** React Router DOM
- **State Management:** Zustand
- **HTTP:** Axios
- **UI:** Radix UI + Lucide React
- **Animation:** Framer Motion
- **Notifications:** react-hot-toast
- **Utilities:** clsx, dayjs
- **Tooling:** ESLint, Prettier

## Getting Started

Requirements: Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

## Folder Structure

```text
src/
  app/            # App entry, providers, and router configuration
  components/
    common/       # Shared, reusable components
    layout/       # Navbar, Footer, and other layout pieces
    ui/           # Low-level UI primitives
  features/
    crypto/       # Crypto feature module
      components/
      hooks/
      services/
      types/
      utils/
  hooks/          # App-wide hooks
  layouts/        # Route layouts (e.g. DashboardLayout)
  pages/
    Dashboard/    # Dashboard page
    NotFound/     # 404 page
  services/       # Shared services (HTTP client, etc.)
  store/          # Zustand stores
  types/          # Shared TypeScript types
  utils/          # Shared utilities
  constants/      # App-wide constants
  assets/         # Static assets
  styles/         # Global styles
```

## Available Scripts

| Script                 | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the Vite dev server.             |
| `npm run build`        | Type-check and build for production.   |
| `npm run preview`      | Preview the production build locally.  |
| `npm run lint`         | Run ESLint.                            |
| `npm run lint:fix`     | Run ESLint and auto-fix issues.        |
| `npm run format`       | Format the codebase with Prettier.     |
| `npm run format:check` | Check formatting without writing.      |
| `npm run type-check`   | Run the TypeScript compiler (no emit). |

## Environment Variables

| Variable                 | Description           |
| ------------------------ | --------------------- |
| `VITE_COINGECKO_API_URL` | Base URL for the API. |

See `.env.example` for the full list.
