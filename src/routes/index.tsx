import { createBrowserRouter, type RouteObject } from 'react-router';
import Root from './root/layout';
import Home from '@/routes/home';
import AuthLayout from '@/routes/auth/layout';
import ErrorBoundary from '@/components/provider/error-boundary';
import Suspense from '@/components/ui/suspense';
import Onboarding from './onboarding/layout';

const routes = [
  {
    path: '/',
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    hydrateFallbackElement: <Suspense />,
    children: [
      { index: true, Component: Home },
      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          {
            path: 'login',
            lazy: async () => {
              const { default: Component } = await import('./auth/login');
              return { Component: Component };
            },
          },
          {
            path: 'register',
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

          // {
          //   path: "set-new-password",
          //   lazy: async () => {
          //     const { default: Component } =
          //       await import("./auth/set-new-password");
          //     return { Component };
          //   },
          // },
        ],
      },
      {
        path: 'onboarding',
        Component: Onboarding,
        children: [
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
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/steptwo');
              return { Component: Component };
            },
          },
          {
            path: 'step-three',
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/stepthree');
              return { Component: Component };
            },
          },
          {
            path: 'step-four',
            lazy: async () => {
              const { default: Component } =
                await import('./onboarding/stepfour');
              return { Component: Component };
            },
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes as RouteObject[]);

export default router;
