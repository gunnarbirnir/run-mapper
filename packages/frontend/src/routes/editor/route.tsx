import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <Outlet />;
}
