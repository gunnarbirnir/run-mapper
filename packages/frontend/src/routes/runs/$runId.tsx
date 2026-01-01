import { createFileRoute } from '@tanstack/react-router';

import { MapContainer } from '~/components/MapContainer';

export const Route = createFileRoute('/runs/$runId')({
  component: RunDetail,
});

function RunDetail() {
  // const { runId } = Route.useParams();

  return <MapContainer />;
}
