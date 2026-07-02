import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout';
import { Navbar } from '@/components/layout';

/**
 * Responsive dashboard shell: fixed navbar and footer with a flexible
 * main content area that renders the active route.
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-white px-4 py-2 text-sm font-medium text-brand-600 shadow focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:not-sr-only dark:bg-slate-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-responsive flex-1 py-6 focus:outline-none sm:py-8"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
