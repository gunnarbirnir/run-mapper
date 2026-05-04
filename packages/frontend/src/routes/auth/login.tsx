import { createFileRoute } from '@tanstack/react-router';

import { LoginCard } from '~/components/LoginCard';
import { PageLayout } from '~/components/PageLayout';
import { ShaderBackground } from '~/components/ShaderBackground';

export const Route = createFileRoute('/auth/login')({
  component: Login,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
});

function Login() {
  return (
    <PageLayout>
      <div className="flex-1 bg-white" />
      <ShaderBackground
        scaleDownByPixelRatio
        className="absolute top-0 left-0 h-full w-full"
      />
      <PageLayout.MainContent className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <LoginCard />
      </PageLayout.MainContent>
    </PageLayout>
  );
}
