import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { api } from '~/service';
import { PageLayout } from '~/components/PageLayout';
import { useAuthState } from '~/hooks/useAuthState';
import { Button, Text } from '~/primitives';
import type { EditorRun, ApiResponse } from '~/types';

export const Route = createFileRoute('/runs/')({
  component: Runs,
});

function Runs() {
  const { user } = useAuthState();
  const { data, isLoading, error } = useQuery<ApiResponse<EditorRun[]>>({
    queryKey: ['runs-list', user?.uid],
    queryFn: () => api.get(`/runs/list`),
  });

  if (error) {
    return (
      <PageLayout>
        <PageLayout.ErrorContent
          title="Error"
          message="Something went wrong while fetching your runs. Please try again later."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout isLoading={isLoading}>
      <PageLayout.MainContent title="Runs">
        {data?.data.length === 0 && (
          <Text variant="paragraph" className="mb-6">
            No runs yet. Create your first run!
          </Text>
        )}
        <Button linkTo="/editor/run/new">Create New Run</Button>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
