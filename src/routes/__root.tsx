/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import appCss from '~/styles/app.css?url'

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
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="p-4 border-b">
          <div className="container mx-auto flex gap-4">
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/runs"
              activeProps={{
                className: 'font-bold',
              }}
            >
              Runs
            </Link>
            <Link
              to="/runs/new"
              activeProps={{
                className: 'font-bold',
              }}
            >
              New Run
            </Link>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
