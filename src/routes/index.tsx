import { createBrowserRouter, type RouteObject } from "react-router";
import Root from "./root/layout";
import Home from "@/routes/home";
import AuthLayout from "@/routes/auth/layout";
import ErrorBoundary from "@/components/provider/error-boundary";
import Suspense from "@/components/ui/suspense";

const routes = [
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    hydrateFallbackElement: <Suspense />,
    children: [
      { index: true, Component: Home },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            lazy: async () => {
              const { default: Component } = await import("./auth/login");
              return { Component: Component };
            },
          },
          {
            path: "register",
            lazy: async () => {
              const { default: Component } = await import("./auth/register");
              return { Component: Component };
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
    ],
  },
];

const router = createBrowserRouter(routes as RouteObject[]);

export default router;
