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
  const [updatedRunData, setUpdatedRunData] = useState<Partial<EditorRun>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editorError, setEditorError] = useState<Error | null>(null);
  const encodedRunId = encodeURIComponent(runId);

  const handleSuccess = useCallback(
    (message: string) => {
      setSuccessMessage(message);
      setEditorError(null);
    },
    [setSuccessMessage, setEditorError],
  );
  const handleError = useCallback(
    (error: Error) => {
      setSuccessMessage(null);
      setEditorError(error);
    },
    [setSuccessMessage, setEditorError],
  );

  const {
    data: existingRun,
    isLoading,
    error,
  } = useQuery<ApiResponse<EditorRun>>({
    queryKey: ['editor-run', runId],
    queryFn: () => api.get(`/runs/editor/${encodedRunId}`),
  });
  const { data: updatedRun, mutateAsync: updateRun } = useMutation<
    ApiResponse<EditorRun>,
    Error,
    RunUpdate
  >({
    mutationFn: (updatedRun: RunUpdate) =>
      api.put(`/runs/editor/${encodedRunId}`, updatedRun),
    onSuccess: () => {
      handleSuccess('Run updated successfully');
    },
    onError: handleError,
  });
  const { mutateAsync: deleteRun, isPending: isDeleting } = useMutation<
    ApiResponse<void>,
    Error
  >({
    mutationFn: () => api.delete(`/runs/editor/${encodedRunId}`),
    onSuccess: () => {
      navigate({ to: '/runs' });
    },
    onError: handleError,
  });
  const { mutateAsync: publishRun, isPending: isPublishing } = useMutation<
    ApiResponse<EditorRun>,
    Error
  >({
    mutationFn: () => api.put(`/runs/editor/publish/${encodedRunId}`),
    onSuccess: () => {
      handleSuccess('Run published');
      setUpdatedRunData((currentData) => ({
        ...currentData,
        isPublic: true,
      }));
    },
    onError: handleError,
  });
  const { mutateAsync: unpublishRun, isPending: isUnpublishing } = useMutation<
    ApiResponse<EditorRun>,
    Error
  >({
    mutationFn: () => api.put(`/runs/editor/unpublish/${encodedRunId}`),
    onSuccess: () => {
      handleSuccess('Run unpublished');
      setUpdatedRunData((currentData) => ({
        ...currentData,
        isPublic: false,
      }));
    },
    onError: handleError,
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

  const currentRunData = {
    ...(updatedRun || existingRun)?.data,
    ...updatedRunData,
  } as EditorRun;

  return (
    <PageLayout isFullWidth footerHasShadow isLoading={isLoading}>
      <RunEditor
        existingRun={currentRunData}
        error={editorError}
        successMessage={successMessage}
        isDeleting={isDeleting}
        isUpdatingPublicStatus={isPublishing || isUnpublishing}
        onSubmit={updateRun}
        onDeleteRun={deleteRun}
        onPublishRun={publishRun}
        onUnpublishRun={unpublishRun}
      />
    </PageLayout>
  );
}
