import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants';

/** Fallback page rendered for unmatched routes. */
export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link
        to={ROUTES.DASHBOARD}
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
