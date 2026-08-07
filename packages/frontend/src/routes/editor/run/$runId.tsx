import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';

import type { ApiResponse, EditorRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { RunEditor } from '~/components/RunEditor';
import { api } from '~/service';

export const Route = createFileRoute('/editor/run/$runId')({
  component: ExistingRunEditor,
});

function ExistingRunEditor() {
  const { runId } = Route.useParams();
  const encodedRunId = encodeURIComponent(runId);
  const { data, isLoading, error } = useQuery<ApiResponse<EditorRun>>({
    queryKey: ['editor-run', runId],
    queryFn: () => api.get(`/runs/editor/${encodedRunId}`),
  });
  const navigate = useNavigate();
  const {
    mutateAsync: deleteRun,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation<ApiResponse<void>, Error>({
    mutationFn: () => api.delete(`/runs/editor/${encodedRunId}`),
    onSuccess: () => {
      navigate({ to: '/runs' });
    },
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
    <PageLayout isFullWidth footerHasShadow isLoading={isLoading}>
      <RunEditor
        existingRun={data?.data}
        error={deleteError}
        isDeleting={isDeleting}
        onSubmit={console.log}
        onDeleteRun={deleteRun}
      />
    </PageLayout>
  );
}
