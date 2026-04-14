import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { api } from '~/service';
import { PageLayout } from '~/components/PageLayout';
import { RunCard } from '~/components/RunCard';
import { useAuthState } from '~/hooks/useAuthState';
import { Button, Text } from '~/primitives';
import type { ListRun, ApiResponse } from '~/types';

export const Route = createFileRoute('/runs/')({
  component: Runs,
});

function Runs() {
  const { user } = useAuthState();
  const { data, isLoading, error } = useQuery<ApiResponse<ListRun[]>>({
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

  const runs = data?.data || [];

  return (
    <PageLayout isLoading={isLoading}>
      <PageLayout.MainContent title="Runs">
        {runs.length === 0 && (
          <Text variant="paragraph" className="mb-6">
            No runs yet. Create your first run!
          </Text>
        )}
        <Button linkTo="/editor/run/new">Create new run</Button>
        {runs.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {runs.map((run, index) => (
              <RunCard key={run.id + index} run={run} />
            ))}
          </div>
        )}
      </PageLayout.MainContent>
    </PageLayout>
  );
}
