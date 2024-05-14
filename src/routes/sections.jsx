import { jwtDecode } from 'jwt-decode';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, useLocation } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const EventDetailPage = lazy(() => import('src/pages/event-detail'));
export const EventPage = lazy(() => import('src/pages/event'));
export const UserEventPage = lazy(() => import('src/pages/user-event'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));


// ----------------------------------------------------------------------

export default function Router() {
  function isAdmin(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.authorities && decoded.authorities.includes('ROLE_ADMIN');
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }
  function isUser(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.authorities && (decoded.authorities.includes('ROLE_USER')||decoded.authorities.includes('ROLE_ADMIN'));
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const personalIsAdmin = isAdmin(token);
  const personalIsUser = isUser(token);
  // const isAdmin=true;
  const routes = useRoutes([
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
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'event', element: <EventPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        {
          path:'profile',
          element:<ProfilePage/>
        },
      ],
    },
    {
      element:personalIsUser?(
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      ),
      children: [
        { element: <IndexPage />, index: true },
        {
          path: 'event/:id',
          element: <EventDetailPage />,
        },
        { path: 'user', element: <UserPage /> },
        { path: 'event', element: <UserEventPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'profile',element:<ProfilePage/>},
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
