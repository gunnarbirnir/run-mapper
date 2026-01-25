import { useCallback, useMemo, useRef, useState } from 'react';

import { ElevationGraph } from '~/components/ElevationGraph';
import { RouteMap } from '~/components/RouteMap';
import type { WidgetType } from '~/types';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';
import { RouteOverlay } from './RouteOverlay';

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

  const runRouteRef = useRef<HTMLDivElement>(null);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);
  const fitInitialBoundsRef = useRef<(() => void) | null>(null);

  const [activeWidget, setActiveWidget] = useState<WidgetType | null>(null);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const handleFitInitialBounds = useCallback(() => {
    fitInitialBoundsRef.current?.();
  }, []);

  return (
    <div className="isolate flex h-full w-full flex-col" ref={runRouteRef}>
      <div className="flex-1">
        <RouteMap
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          hideActiveMarker={activeWidget === 'elevation'}
          setActiveIndexRef={setActiveIndexRef}
          fitInitialBoundsRef={fitInitialBoundsRef}
          setIsAtInitialBounds={setIsAtInitialBounds}
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
        runRouteRef={runRouteRef}
        activeWidget={activeWidget}
        isAtInitialBounds={isAtInitialBounds}
        setActiveWidget={setActiveWidget}
        onFitInitialBounds={handleFitInitialBounds}
      />
    </div>
  );
};

export type { RunRouteProps };
