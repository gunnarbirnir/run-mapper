import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { PageLayout } from '~/components/PageLayout';
import { RunEditor } from '~/components/RunEditor';
import { api } from '~/service';
import { EditorRun, ApiResponse, RunUpdate } from '~/types';
import { formatDocumentTitle } from '~/utils';

export const Route = createFileRoute('/editor/run/new')({
  component: NewRunEditor,
  head: () => ({
    meta: [{ title: formatDocumentTitle('New run') }],
  }),
});

function NewRunEditor() {
  const navigate = useNavigate();
  const { mutateAsync, error } = useMutation<
    ApiResponse<EditorRun>,
    Error,
    RunUpdate
  >({
    mutationFn: (newRun: RunUpdate) => api.post(`/runs/editor`, newRun),
    onSuccess: (data) => {
      navigate({ to: '/editor/run/$runId', params: { runId: data.data.id } });
    },
  });

  return (
    <PageLayout isFullWidth>
      <RunEditor onSubmit={mutateAsync} error={error} />
    </PageLayout>
  );
}
