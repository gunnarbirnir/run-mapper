import { useMemo, useRef } from 'react';

import { RouteMap } from '~/components/RouteMap';
import type { PublicRun, Waypoint } from '~/types';

import { getRouteBounds, processRunRoute } from '../RunRoute/utils';

interface PublicRunRouteProps {
  routeId: string;
  run: PublicRun;
}

const noop = () => {};

export const PublicRunRoute = ({ routeId, run }: PublicRunRouteProps) => {
  const bounds = useMemo(
    () => getRouteBounds(run.boundingBox),
    // Only update map if routeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  const { coordinates } = useMemo(
    () => processRunRoute(run.coordinates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const waypoints = useMemo(() => run.waypoints, [routeId]);

  const setActiveIndexRef = useRef<((updatedIndex: number | null) => void) | null>(
    null,
  );
  const fitInitialBoundsRef = useRef<(() => void) | null>(null);
  const setActiveWaypointRef = useRef<((waypoint: Waypoint) => void) | null>(
    null,
  );

  return (
    <div className="h-full w-full">
      <RouteMap
        routeId={routeId}
        bounds={bounds}
        coordinates={coordinates}
        waypoints={waypoints}
        style="standard"
        showWaypoints={false}
        hideActiveMarker
        setActiveIndexRef={setActiveIndexRef}
        fitInitialBoundsRef={fitInitialBoundsRef}
        setActiveWaypointRef={setActiveWaypointRef}
        setIsAtInitialBounds={noop}
        onWaypointClick={noop}
      />
    </div>
  );
};
