import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

import type { ApiResponse, EditorRun, RunUpdate } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { RunEditor } from '~/components/RunEditor';
import { api } from '~/service';

export const Route = createFileRoute('/editor/run/$runId')({
  component: ExistingRunEditor,
});

function ExistingRunEditor() {
  const { runId } = Route.useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const encodedRunId = encodeURIComponent(runId);

  const {
    data: existingRun,
    isLoading,
    error,
  } = useQuery<ApiResponse<EditorRun>>({
    queryKey: ['editor-run', runId],
    queryFn: () => api.get(`/runs/editor/${encodedRunId}`),
  });
  const {
    data: updatedRun,
    mutateAsync: updateRun,
    error: updateError,
  } = useMutation<ApiResponse<EditorRun>, Error, RunUpdate>({
    mutationFn: (updatedRun: RunUpdate) =>
      api.put(`/runs/editor/${encodedRunId}`, updatedRun),
    onSuccess: () => {
      setSuccessMessage('Run updated successfully');
    },
  });
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

  const onSubmit = useCallback(
    (updatedRun: RunUpdate) => {
      setSuccessMessage(null);
      return updateRun(updatedRun);
    },
    [updateRun],
  );
  const onDeleteRun = useCallback(() => {
    setSuccessMessage(null);
    return deleteRun();
  }, [deleteRun]);

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
        existingRun={(updatedRun || existingRun)?.data}
        error={updateError || deleteError}
        successMessage={successMessage}
        isDeleting={isDeleting}
        onSubmit={onSubmit}
        onDeleteRun={onDeleteRun}
      />
    </PageLayout>
  );
}
