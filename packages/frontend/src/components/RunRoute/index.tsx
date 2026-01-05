import {
  MapContainer,
  type MapContainerProps,
} from '~/components/MapContainer';
import { ElevationGraph } from '~/components/ElevationGraph';
import { RouteWidget } from '~/components/RouteWidget';

import type { RunRouteProps } from './types';

export const RunRoute = ({ routeId, routeData }: RunRouteProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative isolate flex-1">
        <div className="absolute top-4 left-4 z-100">
          <div className="flex flex-col gap-4">
            <RouteWidget>Widget 1</RouteWidget>
            <RouteWidget>Widget 2</RouteWidget>
          </div>
        </div>
        <MapContainer
          routeId={routeId}
          bounds={routeData.bbox as [number, number, number, number]}
          routeFeatures={
            routeData.features as unknown as MapContainerProps['routeFeatures']
          }
        />
      </div>
      <ElevationGraph />
    </div>
  );
};

export type { RunRouteProps };
