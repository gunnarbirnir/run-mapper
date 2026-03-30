import { createFileRoute } from '@tanstack/react-router';

import { PageLayout } from '~/components/PageLayout';
import { SignUpCard } from '~/components/SignUpCard';
import { SwirlBackground } from '~/components/SwirlBackground';

export const Route = createFileRoute('/auth/signup')({
  component: SignUp,
});

function SignUp() {
  return (
    <PageLayout>
      <div className="flex-1 bg-white" />
      <SwirlBackground />
      <PageLayout.MainContent className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <SignUpCard />
      </PageLayout.MainContent>
    </PageLayout>
  );
}
