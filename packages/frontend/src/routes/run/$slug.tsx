import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { api } from '~/service';
import type { ApiResponse, PublicRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { areCssVariablesLoaded } from '~/utils';
import { LoadingSpinner, Text } from '~/primitives';

export const Route = createFileRoute('/run/$slug')({
  component: PublicRun,
  validateSearch: (search: Record<string, unknown>) => ({
    isFullscreen: search.isFullscreen === true,
    routeId: search.routeId as string | undefined,
  }),
});

function PublicRun() {
  const { slug } = Route.useParams();
  const { isFullscreen, routeId } = Route.useSearch();
  const { data, isLoading, error } = useQuery<ApiResponse<PublicRun>>({
    queryKey: ['public-run', slug],
    queryFn: () => api.get(`/runs/public/${encodeURIComponent(slug)}`),
  });
  const activeRouteId = routeId ?? data?.data.defaultRouteId ?? '';

  // Public run relies on window object and css variables
  if (isLoading || !areCssVariablesLoaded() || typeof window === 'undefined') {
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
      />
    </PageLayout>
  );
}

const Fallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout isFullscreenDisplay>
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 p-6">
        {children}
      </div>
    </PageLayout>
  );
};

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Fallback>
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <Text
          element="h1"
          className="text-primary-500 mb-0 text-4xl font-extrabold"
        >
          Error
        </Text>
        <Text variant="paragraph">{message}</Text>
      </div>
    </Fallback>
  );
};
