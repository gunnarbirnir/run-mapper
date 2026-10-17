import { Button } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export function NotFound() {
  return (
    <PageLayout>
      <PageLayout.ErrorContent
        title="Page not found"
        message="The page you're looking for doesn't exist or has been moved."
      >
        <Button linkTo="/" className="mt-8">
          Go home
        </Button>
      </PageLayout.ErrorContent>
    </PageLayout>
  );
}
