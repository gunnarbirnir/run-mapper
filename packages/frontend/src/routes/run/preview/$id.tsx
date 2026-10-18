import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { api } from '~/service';
import type { ApiResponse, PublicRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { LoadingSpinner } from '~/primitives';
import { formatDocumentTitle } from '~/utils';
import { useSetDocumentTitle } from '~/hooks/useSetDocumentTitle';

import { Fallback, ErrorMessage } from '../$slug';

export const Route = createFileRoute('/run/preview/$id')({
  ssr: false,
  component: RunPreview,
  validateSearch: (search: Record<string, unknown>) => ({
    isFullscreen: search.isFullscreen === true,
    routeId: search.routeId as string | undefined,
  }),
  head: () => ({
    meta: [{ title: formatDocumentTitle('Run preview') }],
  }),
});

function RunPreview() {
  const { id } = Route.useParams();
  const { isFullscreen, routeId } = Route.useSearch();
  const { data, isLoading, error } = useQuery<ApiResponse<PublicRun>>({
    queryKey: ['run-preview', id],
    queryFn: () => api.get(`/runs/preview/${encodeURIComponent(id)}`),
  });
  useSetDocumentTitle(data?.data.name);
  const activeRouteId = routeId ?? data?.data.defaultRouteId ?? '';

  if (isLoading) {
    return (
      <Fallback>
        <LoadingSpinner className="text-primary-500 size-10" />
      </Fallback>
    );
  }

  if (
    data?.data.routes.find((route) => route.id === activeRouteId) === undefined
  ) {
    return (
      <ErrorMessage message="The route you're looking for was not found." />
    );
  }

  if (error) {
    return (
      <ErrorMessage message="Something went wrong, please try again later." />
    );
  }

  return (
    <PageLayout isFullscreenDisplay>
      <PublicRunDisplay
        routeId={activeRouteId}
        run={data.data}
        isFullscreen={isFullscreen}
        isPreview
      />
    </PageLayout>
  );
}
