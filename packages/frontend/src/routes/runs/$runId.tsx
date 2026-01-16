import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { RunRoute } from '~/components/RunRoute';
import { api } from '~/service';
import type { ApiResponse, Run } from '~/types';

export const Route = createFileRoute('/runs/$runId')({
  component: RunDetail,
});

function RunDetail() {
  const { runId } = Route.useParams();
  const { data, isPending, error } = useQuery<ApiResponse<Run>>({
    queryKey: ['run', runId],
    queryFn: () => api.get(`/runs/${runId}`),
  });

  if (isPending) {
    return <Fallback>Loading...</Fallback>;
  }

  if (error) {
    return <Fallback>Error: {error.message}</Fallback>;
  }

  return <RunRoute routeId={runId} run={data.data} />;
}

const Fallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-300">
      {children}
    </div>
  );
};
