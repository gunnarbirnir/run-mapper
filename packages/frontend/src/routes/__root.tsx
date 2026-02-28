/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useMatchRoute,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';

import appCss from '~/styles/app.css?url';
import { AuthProvider } from '~/contexts/AuthContext';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Spretta',
      },
      {
        name: 'description',
        content: 'Create engaging and insightful routes for your runs.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const matchRoute = useMatchRoute();
  const isPublicRun = Boolean(matchRoute({ to: '/run/$slug' }));
  const disableDevTools = import.meta.env.VITE_DISABLE_DEV_TOOLS === 'true';

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {!isPublicRun && !disableDevTools && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
        <Scripts />
      </body>
    </html>
  );
}
