/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useMatchRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';

import appCss from '~/styles/app.css?url';

import { NavBar } from '~/components/NavBar';

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
        title: 'Run Mapper - Visualize Your Running Routes',
      },
      {
        name: 'description',
        content: 'Create and visualize running routes with interactive iframes',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootBody>{children}</RootBody>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootBody({ children }: { children: React.ReactNode }) {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/runs/$runId' });
  const isRunDisplay = params && params.runId !== 'new';

  if (isRunDisplay) {
    return <main className="h-screen w-screen">{children}</main>;
  }

  return (
    <>
      <NavBar />
      <main className="px-4 py-6">
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
}
