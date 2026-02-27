import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ProtectedRoute } from '~/components/ProtectedRoute';
import { useAuth } from '~/contexts/AuthContext';
import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { api } from '~/service';
import { Button, Form, Text } from '~/primitives';
import type { ApiResponse, EditorRun } from '~/types';

export const Route = createFileRoute('/editor/runs/$runId')({
  component: EditorRunDetail,
});

function EditorRunDetail() {
  const { runId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [slugInput, setSlugInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { data, isPending, error } = useQuery<ApiResponse<EditorRun>>({
    queryKey: ['editor-runs', runId],
    queryFn: () => api.get(`/editor-runs/${runId}`),
    enabled: !authLoading && Boolean(user),
  });
  const publishMutation = useMutation({
    mutationFn: ({
      isPublic,
      publicSlug,
    }: {
      isPublic: boolean;
      publicSlug?: string;
    }) =>
      api.put<ApiResponse<EditorRun>>(`/runs/${runId}`, {
        isPublic,
        ...(publicSlug ? { publicSlug } : {}),
      }),
    onSuccess: async (response) => {
      setCopied(false);
      setSlugInput(response.data.slug ?? '');
      await queryClient.invalidateQueries({ queryKey: ['run', runId] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.delete<ApiResponse<{ id: string }>>(`/runs/${runId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['runs'] });
      navigate({ to: '/editor/runs' });
    },
  });

  if (isPending) {
    return (
      <ProtectedRoute>
        <Fallback>Loading...</Fallback>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Fallback>Error: {error.message}</Fallback>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <Fallback>Loading...</Fallback>
      </ProtectedRoute>
    );
  }

  const run = data.data;
  const currentSlug = run.slug ?? '';
  const shareUrl =
    run.isPublic && currentSlug
      ? `${
          import.meta.env.VITE_FRONTEND_BASE_URL ||
          (typeof window !== 'undefined' ? window.location.origin : '')
        }/route/${currentSlug}`
      : '';

  const handlePublish = async () => {
    const normalizedSlug = (slugInput || currentSlug).trim().toLowerCase();
    if (!normalizedSlug) {
      return;
    }
    await publishMutation.mutateAsync({
      isPublic: true,
      publicSlug: normalizedSlug,
    });
  };

  const handleUnpublish = async () => {
    await publishMutation.mutateAsync({ isPublic: false });
  };

  const handleCopy = async () => {
    if (!shareUrl || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      'Delete this run permanently? This action cannot be undone.',
    );
    if (!shouldDelete) {
      return;
    }

    await deleteMutation.mutateAsync();
  };

  return (
    <ProtectedRoute>
      <div className="relative h-full w-full">
        <div className="pointer-events-auto absolute top-4 left-4 z-200 w-[360px] rounded-lg border border-gray-300 bg-white p-4 shadow-md">
          <Text element="h2" className="mb-2">
            Share Run
          </Text>
          <Form className="space-y-3">
            <Form.TextInput
              id="public-slug"
              name="public-slug"
              label="Public slug"
              placeholder="e.g. city-marathon-route"
              value={slugInput || currentSlug}
              onChange={(value) => setSlugInput(value)}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={publishMutation.isPending}
                onClick={handlePublish}
              >
                {run.isPublic ? 'Update Share URL' : 'Publish Run'}
              </Button>
              {run.isPublic && (
                <Button
                  type="button"
                  color="white"
                  disabled={publishMutation.isPending}
                  onClick={handleUnpublish}
                >
                  Unpublish
                </Button>
              )}
            </div>
          </Form>

          {run.isPublic && shareUrl && (
            <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3">
              <Text variant="subtle" className="mb-1 text-xs">
                Share URL
              </Text>
              <Text className="mb-2 text-sm break-all">{shareUrl}</Text>
              <Button type="button" color="white" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>
          )}

          {publishMutation.isError && (
            <Text className="mt-2 text-sm text-red-700">
              {publishMutation.error instanceof Error
                ? publishMutation.error.message
                : 'Failed to update publish settings'}
            </Text>
          )}

          <div className="mt-4 border-t border-gray-200 pt-3">
            <Text variant="subtle" className="mb-2 text-xs">
              Danger zone
            </Text>
            <Button
              type="button"
              color="white"
              className="border border-red-300 text-red-700! hover:bg-red-50!"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Run'}
            </Button>
            {deleteMutation.isError && (
              <Text className="mt-2 text-sm text-red-700">
                {deleteMutation.error instanceof Error
                  ? deleteMutation.error.message
                  : 'Failed to delete run'}
              </Text>
            )}
          </div>
        </div>
        <PublicRunDisplay routeId={runId} run={run} />
      </div>
    </ProtectedRoute>
  );
}

const Fallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-300">
      {children}
    </div>
  );
};
