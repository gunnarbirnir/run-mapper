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

import { NavBar } from '~/components/NavBar';
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
        content: 'Create and visualize running routes with interactive iframes',
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
  const isPlayground = Boolean(matchRoute({ to: '/playground' }));
  const publicRunParams = matchRoute({ to: '/public-runs/$slug' });
  const isPublicRun = Boolean(publicRunParams);

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootBody isFullscreenDisplay={isPublicRun} isPlayground={isPlayground}>
          {children}
        </RootBody>
        {!isPublicRun && <TanStackRouterDevtools position="bottom-right" />}
        <Scripts />
      </body>
    </html>
  );
}

function RootBody({
  children,
  isFullscreenDisplay,
  isPlayground,
}: {
  children: React.ReactNode;
  isFullscreenDisplay: boolean;
  isPlayground: boolean;
}) {
  if (isFullscreenDisplay) {
    return <main className="h-screen w-screen">{children}</main>;
  }

  return (
    <>
      {!isPlayground && <NavBar />}
      <main className="px-4 py-6">
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
}
