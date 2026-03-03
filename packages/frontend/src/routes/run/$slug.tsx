import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { PublicRunDisplay } from '~/components/PublicRunDisplay';
import { api } from '~/service';
import type { ApiResponse, PublicRun } from '~/types';
import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/run/$slug')({
  component: PublicRun,
  validateSearch: (search: Record<string, unknown>) => ({
    isFullscreen: search.isFullscreen === true,
  }),
});

function PublicRun() {
  const { slug } = Route.useParams();
  const { isFullscreen } = Route.useSearch();
  const { data, isPending, error } = useQuery<ApiResponse<PublicRun>>({
    queryKey: ['public-runs', slug],
    queryFn: () => api.get(`/runs/public/${encodeURIComponent(slug)}`),
  });

  if (isPending) {
    return <Fallback>Loading...</Fallback>;
  }

  if (error) {
    return <Fallback>Error: {error.message}</Fallback>;
  }

  return (
    <PageLayout isFullscreenDisplay>
      <PublicRunDisplay
        routeId={slug}
        run={data.data}
        isFullscreen={isFullscreen}
      />
    </PageLayout>
  );
}

const Fallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout isFullscreenDisplay>
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-300">
        {children}
      </div>
    </PageLayout>
  );
};
