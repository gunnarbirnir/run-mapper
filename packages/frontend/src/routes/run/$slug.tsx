import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { api } from '~/service';
import type { ApiResponse, PublicRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';
import { areCssVariablesLoaded } from '~/utils';
import { LoadingSpinner, Text, Icon } from '~/primitives';

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
  const { data, isPending, error } = useQuery<ApiResponse<PublicRun>>({
    queryKey: ['public-runs', slug],
    queryFn: () => api.get(`/runs/public/${encodeURIComponent(slug)}`),
  });
  const activeRouteId = routeId ?? data?.data.defaultRouteId ?? '';

  // Public run relies on window object and css variables
  if (isPending || !areCssVariablesLoaded() || typeof window === 'undefined') {
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
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200 p-6">
        {children}
      </div>
    </PageLayout>
  );
};

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Fallback>
      <div className="pb-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="error" className="text-error-500 size-5" />
          <Text variant="label" className="text-error-500 text-sm">
            Error
          </Text>
        </div>
        <Text variant="medium">{message}</Text>
      </div>
    </Fallback>
  );
};
