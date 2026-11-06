import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { RunFallback, RunErrorMessage } from '~/components/RunFallback';
import { api } from '~/service';
import type { ApiResponse, PublicRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { LoadingSpinner } from '~/primitives';
import { formatDocumentTitle } from '~/utils';
import { useSetDocumentTitle } from '~/hooks/useSetDocumentTitle';

export const Route = createFileRoute('/run/$slug')({
  ssr: false,
  component: PublicRun,
  validateSearch: (search: Record<string, unknown>) => ({
    isFullscreen: search.isFullscreen === true,
    routeId: search.routeId as string | undefined,
  }),
  head: () => ({
    meta: [{ title: formatDocumentTitle('Run') }],
  }),
});

function PublicRun() {
  const { slug } = Route.useParams();
  const { isFullscreen, routeId } = Route.useSearch();
  const { data, isLoading, error } = useQuery<ApiResponse<PublicRun>>({
    queryKey: ['public-run', slug],
    queryFn: () => api.get(`/runs/public/${encodeURIComponent(slug)}`),
  });
  useSetDocumentTitle(data?.data.name);
  const initialRouteId = routeId ?? data?.data.defaultRouteId;

  if (isLoading) {
    return (
      <RunFallback>
        <LoadingSpinner className="text-primary-500 size-10" />
      </RunFallback>
    );
  }

  if (
    data?.data.routes.find((route) => route.id === initialRouteId) === undefined
  ) {
    return (
      <RunErrorMessage message="The route you're looking for was not found." />
    );
  }

  if (error) {
    return (
      <RunErrorMessage message="Something went wrong, please try again later." />
    );
  }

  return (
    <PageLayout isFullscreenDisplay>
      <PublicRunDisplay
        initialRouteId={initialRouteId}
        run={data.data}
        isFullscreen={isFullscreen}
      />
    </PageLayout>
  );
}
