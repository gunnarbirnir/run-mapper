import { createFileRoute } from '@tanstack/react-router';

import { useSetDocumentTitle } from '~/hooks/useSetDocumentTitle';
import { RunErrorMessage } from '~/components/RunFallback';

export const Route = createFileRoute('/auth/error')({
  component: AuthError,
});

function AuthError() {
  useSetDocumentTitle('Authentication error');

  return (
    <RunErrorMessage message="You are not authorized to access this page." />
  );
}
