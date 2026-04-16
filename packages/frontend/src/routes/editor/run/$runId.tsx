import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, EditorRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { RunEditor } from '~/components/RunEditor';
import { api } from '~/service';

export const Route = createFileRoute('/editor/run/$runId')({
  component: ExistingRunEditor,
});

function ExistingRunEditor() {
  const { runId } = Route.useParams();
  const { data, isLoading, error } = useQuery<ApiResponse<EditorRun>>({
    queryKey: ['editor-run', runId],
    queryFn: () => api.get(`/runs/editor/${encodeURIComponent(runId)}`),
  });

  if (error) {
    return (
      <PageLayout isFullWidth>
        <PageLayout.ErrorContent
          title="Error"
          message="Something went wrong while fetching run. Please try again later."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout isFullWidth isLoading={isLoading}>
      <RunEditor existingRun={data?.data} />
    </PageLayout>
  );
}
