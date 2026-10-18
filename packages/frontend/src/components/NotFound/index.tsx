import { Button } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';
import { useSetDocumentTitle } from '~/hooks/useSetDocumentTitle';

export function NotFound() {
  useSetDocumentTitle('Page not found');

  return (
    <PageLayout>
      <PageLayout.ErrorContent
        title="Page not found"
        message="The page you're looking for doesn't exist or has been moved."
      >
        <Button linkTo="/" className="mt-6">
          Go home
        </Button>
      </PageLayout.ErrorContent>
    </PageLayout>
  );
}
