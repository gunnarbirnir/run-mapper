import { createFileRoute } from '@tanstack/react-router';

import { RunRoute, type RunRouteProps } from '~/components/RunRoute';

import routeData from './route.json';

export const Route = createFileRoute('/runs/$runId')({
  component: RunDetail,
});

function RunDetail() {
  const { runId } = Route.useParams();

  return (
    <RunRoute
      routeId={runId}
      routeData={routeData as unknown as RunRouteProps['routeData']}
    />
  );
}
