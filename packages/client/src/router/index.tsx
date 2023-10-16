/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Route from './route';

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
    element: (
      <Route>
        <RegisterPage />
      </Route>
    ),
  },
  {
    path: '/profile',
    element: (
      <Route>
        <ProfilePage />
      </Route>
    ),
  },
  {
    path: '/users/:address',
    element: (
      <Route>
        <ProfilePage />
      </Route>
    ),
  },
  {
    path: '/about',
    element: (
      <Route>
        <div>About</div>
      </Route>
    ),
  },
  {
    path: '*',
    element: <div>Not Found</div>,
  },
]);

export default router;
