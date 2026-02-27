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
import { Footer } from '~/components/Footer';
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
  const isPlayground = Boolean(matchRoute({ to: '/playground' }));
  const isPublicRun = Boolean(matchRoute({ to: '/run/$slug' }));
  const disableDevTools = import.meta.env.VITE_DISABLE_DEV_TOOLS === 'true';

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootBody isFullscreenDisplay={isPublicRun} isPlayground={isPlayground}>
          {children}
        </RootBody>
        {!isPublicRun && !disableDevTools && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
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
    return (
      <main className="h-screen w-screen" style={{ height: '100dvh' }}>
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ minHeight: '100dvh' }}>
      {!isPlayground && <NavBar />}
      <main className="flex-1 px-4 pt-6 pb-12">
        <div className="container mx-auto">{children}</div>
      </main>
      {!isPlayground && <Footer />}
    </div>
  );
}
