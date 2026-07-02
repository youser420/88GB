import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { DashboardLayout } from '@/layouts';
import { DashboardPage, NotFoundPage } from '@/pages';

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
