import { useMemo, useRef, useState } from 'react';

import { ElevationGraph } from '~/components/ElevationGraph';
import { RouteMap } from '~/components/RouteMap';
import { RouteOverlay } from '~/components/RouteOverlay';
import type { WidgetType } from '~/types';

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

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeWidget, setActiveWidget] = useState<WidgetType | null>(null);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1" ref={mapContainerRef}>
        <RouteMap
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          hideActiveMarker={activeWidget === 'elevation'}
          setActiveIndexRef={setActiveIndexRef}
        />
      </div>
      <ElevationGraph
        elevations={elevations}
        setActiveIndexRef={setActiveIndexRef}
        isExpanded={activeWidget === 'elevation'}
      />
      <RouteOverlay
        coordinates={coordinates}
        elevations={elevations}
        mapContainerRef={mapContainerRef}
        activeWidget={activeWidget}
        setActiveWidget={setActiveWidget}
      />
    </div>
  );
};

export type { RunRouteProps };
