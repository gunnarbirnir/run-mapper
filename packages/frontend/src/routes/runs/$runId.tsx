import { createFileRoute } from '@tanstack/react-router';

import {
  MapContainer,
  type MapContainerProps,
} from '~/components/MapContainer';

import routeData from './route.json';

export const Route = createFileRoute('/runs/$runId')({
  component: RunDetail,
});

function RunDetail() {
  // const { runId } = Route.useParams();

  return (
    <MapContainer
      routeId={routeData.name}
      bounds={routeData.bbox as [number, number, number, number]}
      routeFeatures={
        routeData.features as unknown as MapContainerProps['routeFeatures']
      }
    />
  );
}
