import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import BaseLayout from './layouts/BaseLayout';

import { BASE_URL } from './config/constant';

import ContactUs from './views/ContactUs';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/Login'))
  },
  {
    path: '*',
    layout: BaseLayout,
    routes: [
      {
        exact: 'true',
        path: '/Dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/ContactUs',
        element: lazy(() => import('./views/ContactUs'))
      },
      {
        exact: 'true',
        path: '/Admin/Produktet/Kategorite',
        element: lazy(() => import('./views/admin-dashboard/Produktet/Kategorite'))
      },
      {
        exact: 'true',
        path: '/Admin/Produktet/Kompanite',
        element: lazy(() => import('./views/admin-dashboard/Produktet/Kompanit'))
      },
      {
        exact: 'true',
        path: '/Admin/Klientet',
        element: lazy(() => import('./views/admin-dashboard/Klientet'))
      },

      {
        exact: 'true',
        path: '/admin/TeNdryshme/OfertatSlider',
        element: lazy(() => import('./views/admin-dashboard/TeNdryshme/OfertatSlider'))
      },

      {
        exact: 'true',
        path: '/admin/produktet/ListaEProdukteve',
        element: lazy(() => import('./views/admin-dashboard/Produktet/ListaEProdukteve'))
      },
      {
        exact: true,
        path: '/admin/TeNdryshme/KodiZbritjes',
        element: lazy(() => import('./views/admin-dashboard/TeNdryshme/KodiZbritjes'))
      },
      {
        exact: 'true',
        path: '/admin/mesazhet',
        element: lazy(() => import('./views/admin-dashboard/Mesazhet'))
      },

      {
        exact: 'true',
        path: '/',
        element: lazy(() => import('./views/Home'))
      },
      {
        exact: true,
        path: '/produktet/:id',
        element: lazy(() => import('./views/Produkti'))
      },
      {
        exact: true,
        path: '/produktet/kategoria/:kategoriaid',
        element: lazy(() => import('./views/Produktet'))
      },
      {
        exact: true,
        path: '/produktet/kompania/:kompaniaid',
        element: lazy(() => import('./views/Produktet'))
      },
      {
        exact: true,
        path: '/produktet',
        element: lazy(() => import('./views/Produktet'))
      },
      {
        exact: true,
        path: '/shporta',
        element: lazy(() => import('./views/Shporta'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
