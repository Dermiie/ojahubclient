import { createBrowserRouter, redirect, type RouteObject } from "react-router";

import Root from "./root/layout";
import AuthLayout from "@/routes/auth/layout";
import ErrorBoundary from "@/components/provider/error-boundary";
import Suspense from "@/components/ui/suspense";
import Onboarding from "./onboarding/layout";

import {
  guestLoader,
  onboardingLoader,
  protectedLoader,
  requireBusinessLoader,
} from "./guards";

import DashboardOverview from "./Dashboard";
import DashboardLayout from "./Dashboard/layout";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Root,
    ErrorBoundary,
    hydrateFallbackElement: <Suspense />,
    handle: {
      seo: {
        title: "Oja Hub",
        description: "Trade and connect with your customers.",
      },
    },
    children: [
      // AUTHENTICATION
      {
        path: "auth",
        Component: AuthLayout,
        loader: guestLoader,
        children: [
          {
            path: "login",
            handle: {
              seo: {
                title: "Oja Hub",
                description: "Login to your account",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("./auth/login");
              return { Component };
            },
          },
          {
            path: "register",
            handle: {
              seo: {
                title: "Oja Hub",
                description: "create an account",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("./auth/register");
              return { Component };
            },
          },
          {
            path: "forgot-password",
            lazy: async () => {
              const { default: Component } =
                await import("./auth/forgot-password");
              return { Component };
            },
          },
          {
            path: "verify",
            lazy: async () => {
              const { default: Component } = await import("./auth/verify");
              return { Component };
            },
          },
          {
            path: "set-new-password",
            lazy: async () => {
              const { default: Component } =
                await import("./auth/set-new-password");
              return { Component };
            },
          },
        ],
      },

      // ONBOARDING
      {
        path: "onboarding",
        Component: Onboarding,
        loader: onboardingLoader,
        children: [
          {
            index: true,
            loader: () => redirect("step-one"),
          },
          {
            path: "step-one",
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/stepone");
              return { Component };
            },
          },
          {
            path: "step-two",
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/steptwo");
              return { Component };
            },
          },
          {
            path: "step-three",
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/stepthree");
              return { Component };
            },
          },
          {
            path: "step-four",
            loader: requireBusinessLoader,
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/stepfour");
              return { Component };
            },
          },
          {
            path: "success",
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/success");
              return { Component };
            },
          },
          {
            path: "expired",
            lazy: async () => {
              const { default: Component } =
                await import("./onboarding/expired");
              return { Component };
            },
          },
        ],
      },

      // DEVELOPMENT INVOICE PREVIEW
      ...(import.meta.env.DEV
        ? [
            {
              path: "__dev",
              Component: DashboardLayout,
              children: [
                {
                  path: "invoice-preview",
                  lazy: async () => {
                    const { default: Component } =
                      await import("./Dashboard/invoices/invoicepage");
                    return { Component };
                  },
                },
                {
                  path: "invoice-preview/:invoiceNo",
                  lazy: async () => {
                    const { default: Component } =
                      await import("./Dashboard/invoices/invoicedetail");
                    return { Component };
                  },
                },
                {
                  path: "new-invoice",
                  lazy: async () => {
                    const { default: Component } =
                      await import("./Dashboard/invoices/newinvoice");
                    return { Component };
                  },
                },
                {
                  path: "review-invoice",
                  lazy: async () => {
                    const { default: Component } =
                      await import("./Dashboard/invoices/reviewinvoice");
                    return { Component };
                  },
                },
                {
                  path: "invoice-ready/:invoiceNo",
                  lazy: async () => {
                    const { default: Component } =
                      await import("./Dashboard/invoices/invoiceready");
                    return { Component };
                  },
                },
              ],
            },
          ]
        : []),

      // PROTECTED DASHBOARD ROUTES
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
              {
                path: "dashboard",
                loader: () => redirect("/"),
              },

              // INVOICES
              {
                path: "invoices",
                children: [
                  {
                    index: true,
                    lazy: async () => {
                      const { default: Component } =
                        await import("./Dashboard/invoices/invoicepage");
                      return { Component };
                    },
                  },
                  {
                    path: "new",
                    lazy: async () => {
                      const { default: Component } =
                        await import("./Dashboard/invoices/newinvoice");
                      return { Component };
                    },
                  },
                  {
                    path: "new/review",
                    lazy: async () => {
                      const { default: Component } =
                        await import("./Dashboard/invoices/reviewinvoice");
                      return { Component };
                    },
                  },
                  {
                    path: ":invoiceNo/ready",
                    lazy: async () => {
                      const { default: Component } =
                        await import("./Dashboard/invoices/invoiceready");
                      return { Component };
                    },
                  },
                  {
                    path: ":invoiceNo",
                    lazy: async () => {
                      const { default: Component } =
                        await import("./Dashboard/invoices/invoicedetail");
                      return { Component };
                    },
                  },
                ],
              },

              // CUSTOMERS
              {
                path: "customers",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/customers");
                  return { Component };
                },
              },

              // PRODUCTS
              {
                path: "products",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/products");
                  return { Component };
                },
              },

              // LOCATIONS
              {
                path: "locations",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/locations");
                  return { Component };
                },
              },

              // TRANSFERS
              {
                path: "transfers",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/transfers");
                  return { Component };
                },
              },

              // PAYMENTS
              {
                path: "payments",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/payments");
                  return { Component };
                },
              },

              // SETTINGS
              {
                path: "settings",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/settings");
                  return { Component };
                },
              },

              // SUPPORT
              {
                path: "support",
                lazy: async () => {
                  const { default: Component } =
                    await import("./Dashboard/support");
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

const router = createBrowserRouter(routes);

export default router;
