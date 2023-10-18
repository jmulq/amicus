/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './route';

const LandingPage = lazy(() => import('../pages/landing'));
const ProfilePage = lazy(() => import('../pages/profile'));
const RegisterPage = lazy(() => import('../pages/register'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:address',
    element: <ProfilePage />,
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
  {
    path: '*',
    element: <div>Not Found</div>,
  },
]);

export default router;
