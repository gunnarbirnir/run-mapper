import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/editor')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isLoaded && !context.auth.user) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      });
    }
  },
  component: EditorLayout,
});

function EditorLayout() {
  const { auth } = Route.useRouteContext();

  if (!auth.isLoaded) {
    return <PageLayout isLoading isFullscreenDisplay />;
  }

  return <Outlet />;
}
