import { createBrowserRouter, redirect, type RouteObject } from 'react-router';
import Root from './root/layout';
import AuthLayout from '@/routes/auth/layout';
import ErrorBoundary from '@/components/provider/error-boundary';
import Suspense from '@/components/ui/suspense';
import Onboarding from './onboarding/layout';

import {
  guestLoader,
  onboardingLoader,
  protectedLoader,
  requireBusinessLoader,
} from './guards';

import DashboardOverview from './Dashboard';
import DashboardLayout from './Dashboard/layout';

const routes = [
  {
    path: '/',
    Component: Root,
    ErrorBoundary,
    hydrateFallbackElement: <Suspense />,
    handle: {
      seo: {
        title: 'Oja Hub',
        description: 'Trade and connect with your customers.',
      },
    },
    children: [
      {
        path: 'auth',
        Component: AuthLayout,
        loader: guestLoader,
        children: [
          {
            path: 'login',
            handle: {
              seo: {
                title: 'Oja Hub',
                description: 'Login to your account',
              },
            },
            lazy: async () => {
              const { default: Component } = await import('./auth/login');
              return { Component: Component };
            },
          },
          {
            path: 'register',
            handle: {
              seo: {
                title: 'Oja Hub',
                description: 'create an account',
              },
            },
            lazy: async () => {
              const { default: Component } = await import('./auth/register');
              return { Component: Component };
            },
          },

          {
            path: 'forgot-password',
            lazy: async () => {
              const { default: Component } =
                await import('./auth/forgot-password');
              return { Component };
            },
          },

          {
            path: 'verify',
            lazy: async () => {
              const { default: Component } = await import('./auth/verify');
              return { Component };
            },
          },

          {
            path: 'set-new-password',
            lazy: async () => {
              const { default: Component } =
                await import('./auth/set-new-password');
              return { Component };
            },
          },
        ],
      },

      {
        path: 'onboarding',
        Component: Onboarding,
        loader: onboardingLoader,
        children: [
          { index: true, loader: () => redirect('step-one') },
          {
            path: 'step-one',
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/stepone');
              return { Component: Component };
            },
          },
          {
            path: 'step-two',
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/steptwo');
              return { Component };
            },
          },
          {
            path: 'step-three',
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/stepthree');
              return { Component: Component };
            },
          },
          {
            path: 'step-four',
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/stepfour');
              return { Component: Component };
            },
          },
          {
            path: `success`,
            lazy: async () => {
              const { default: Component } = await import(
                `./onboarding/success`
              );
              return { Component: Component };
            },
          },
          {
            path: `expired`,
            lazy: async () => {
              const { default: Component } = await import(
                `./onboarding/expired`
              );
              return { Component: Component };
            },
          },
        ],
      },
      {
        loader: protectedLoader,
        children: [
          {
            Component: DashboardLayout,
            children: [
              {
                index: true,
                Component: DashboardOverview,
              },
              { path: 'dashboard', loader: () => redirect('/') },
              {
                path: 'invoices',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/invoices');
                  return { Component };
                },
              },
              {
                path: 'customers',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/customers');
                  return { Component };
                },
              },
              {
                path: 'products',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/products');
                  return { Component };
                },
              },
              {
                path: 'locations',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/locations');
                  return { Component };
                },
              },
              {
                path: 'transfers',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/transfers');
                  return { Component };
                },
              },
              {
                path: 'payments',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/payments');
                  return { Component };
                },
              },
              {
                path: 'settings',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/settings');
                  return { Component };
                },
              },
              {
                path: 'support',
                lazy: async () => {
                  const { default: Component } =
                    await import('./Dashboard/support');
                  return { Component };
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes as RouteObject[]);

export default router;
