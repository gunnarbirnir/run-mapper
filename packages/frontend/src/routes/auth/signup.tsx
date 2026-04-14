import { createFileRoute } from '@tanstack/react-router';

import { PageLayout } from '~/components/PageLayout';
import { SignUpCard } from '~/components/SignUpCard';
import { ShaderBackground } from '~/components/ShaderBackground';

export const Route = createFileRoute('/auth/signup')({
  component: SignUp,
});

function SignUp() {
  return (
    <PageLayout>
      <div className="flex-1 bg-white" />
      <ShaderBackground className="absolute top-0 left-0 h-full w-full" />
      <PageLayout.MainContent className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <SignUpCard />
      </PageLayout.MainContent>
    </PageLayout>
  );
}
