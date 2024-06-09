import { jwtDecode } from 'jwt-decode';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, useLocation } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const ActivityPage = lazy(() => import('src/pages/activity'));
export const UserPage = lazy(() => import('src/pages/user'));
export const EventDetailPage = lazy(() => import('src/pages/event-detail'));
export const EventPage = lazy(() => import('src/pages/event'));
export const UserEventPage = lazy(() => import('src/pages/user-event'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const RegisterAIModelPage = lazy(() => import('src/pages/ai-model'));


// ----------------------------------------------------------------------

export default function Router() {
  function isAdmin() {
    try {
    const token = localStorage.getItem('accessToken');

      const decoded = jwtDecode(token);
      return decoded.authorities && decoded.authorities.includes('ROLE_ADMIN');
    } catch (e) {
      return false;
    }
  }
  function isUser() {
    try {
    const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      return decoded.authorities && (decoded.authorities.includes('ROLE_USER')||decoded.authorities.includes('ROLE_ADMIN'));
    } catch (e) {
      return false;
    }
  }
  const location = useLocation();
  const personalIsAdmin = isAdmin();
  const personalIsUser = isUser();
  // const isAdmin=true;

  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to={personalIsAdmin ? "/admin/event" : "/event"} replace />,
    },
    {
      path: 'admin',
      element: personalIsAdmin ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      ),
      children: [
        { path: 'event', element: <EventPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'activity', element: <ActivityPage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
    {
      element: personalIsUser ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      ),
      children: [
        { path: 'event', element: <UserEventPage />, index: true },
        { path: 'event/:id', element: <EventDetailPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'activity', element: <ActivityPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'ai-model', element: <RegisterAIModelPage /> },
      ],
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
  

  return routes;
}
