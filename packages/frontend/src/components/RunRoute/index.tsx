import { useMemo } from 'react';

import { RouteMap } from '~/components/RouteMap';
import { ElevationGraph } from '~/components/ElevationGraph';
import { DistanceWidget } from '~/components/DistanceWidget';
import { ElevationWidget } from '~/components/ElevationWidget';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRouteFeatures } from './utils';

export const RunRoute = ({ routeId, routeData }: RunRouteProps) => {
  const bounds = useMemo(
    () => getRouteBounds(routeData.bbox as [number, number, number, number]),
    // Only update map if routeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  const { coordinates, elevations } = useMemo(
    () => processRouteFeatures(routeData.features),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative isolate flex-1">
        <div className="absolute top-4 left-4 z-100">
          <div className="flex flex-col gap-4">
            <DistanceWidget coordinates={coordinates} />
            <ElevationWidget elevations={elevations} />
          </div>
        </div>
        <RouteMap routeId={routeId} bounds={bounds} coordinates={coordinates} />
      </div>
      <ElevationGraph />
    </div>
  );
};

export type { RunRouteProps };
