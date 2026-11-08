import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/run/preview')({
  ssr: false,
  beforeLoad: ({ context }) => {
    if (context.auth.isLoaded && !context.auth.user) {
      throw redirect({
        to: '/auth/error',
      });
    }
  },
  component: RunPreviewLayout,
});

function RunPreviewLayout() {
  const { auth } = Route.useRouteContext();

  if (!auth.isLoaded) {
    return <PageLayout isLoading isFullscreenDisplay />;
  }

  return <Outlet />;
}
