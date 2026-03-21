import { createFileRoute } from '@tanstack/react-router';

import { Button, Text } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/404/')({
  component: NotFound,
});

export function NotFound() {
  return (
    <PageLayout>
      <PageLayout.MainContent className="flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Text
            element="h1"
            className="text-primary-500 mb-2 text-8xl font-extrabold"
          >
            404
          </Text>
          <Text element="h2" className="mb-4 text-xl">
            Page not found
          </Text>
          <Text variant="subtle" className="mb-8">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button linkTo="/">Go home</Button>
        </div>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
