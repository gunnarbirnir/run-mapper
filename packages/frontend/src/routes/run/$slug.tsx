import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { RunRoute } from '~/components/RunRoute';
import { api } from '~/service';
import type { ApiResponse, Run } from '~/types';

export const Route = createFileRoute('/run/$slug')({
  component: PublicRun,
  validateSearch: (search: Record<string, unknown>) => ({
    isFullscreen: search.isFullscreen === true,
  }),
});

function PublicRun() {
  const { slug } = Route.useParams();
  const { isFullscreen } = Route.useSearch();
  const { data, isPending, error } = useQuery<ApiResponse<Run>>({
    queryKey: ['public-run', slug],
    queryFn: () => api.get(`/public-run/${encodeURIComponent(slug)}`),
  });

  if (isPending) {
    return <Fallback>Loading...</Fallback>;
  }

  if (error) {
    return <Fallback>Error: {error.message}</Fallback>;
  }

  return (
    <RunRoute routeId={slug} run={data.data} isFullscreen={isFullscreen} />
  );
}

const Fallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-300">
      {children}
    </div>
  );
};
