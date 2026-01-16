import { useMemo, useRef } from 'react';

import { RouteMap } from '~/components/RouteMap';
import { ElevationGraph } from '~/components/ElevationGraph';
import { DistanceWidget } from '~/components/DistanceWidget';
import { ElevationWidget } from '~/components/ElevationWidget';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';

export const RunRoute = ({ routeId, run }: RunRouteProps) => {
  const bounds = useMemo(
    () => getRouteBounds(run.boundingBox),
    // Only update map if routeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  const { coordinates, elevations } = useMemo(
    () => processRunRoute(run.coordinates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const waypoints = useMemo(() => run.waypoints, [routeId]);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative isolate flex-1">
        <div className="absolute top-4 left-4 z-100">
          <div className="flex flex-col gap-4">
            <DistanceWidget coordinates={coordinates} />
            <ElevationWidget elevations={elevations} />
          </div>
        </div>
        <RouteMap
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          setActiveIndexRef={setActiveIndexRef}
        />
      </div>
      <ElevationGraph
        elevations={elevations}
        setActiveIndexRef={setActiveIndexRef}
      />
    </div>
  );
};

export type { RunRouteProps };
