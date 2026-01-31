import { useCallback, useMemo, useRef } from 'react';

import { ElevationGraph } from '~/components/ElevationGraph';
import { RouteMap, useMapState } from '~/components/RouteMap';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';
import { RouteOverlay, useRouteOverlayState } from './RouteOverlay';

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

  const {
    style: mapStyle,
    isAtInitialBounds,
    setStyle: setMapStyle,
    setIsAtInitialBounds,
  } = useMapState();
  const routeOverlayState = useRouteOverlayState();
  const elevationWidgetActive = routeOverlayState.activeWidget === 'elevation';
  const settingsDrawerActive = routeOverlayState.activeDrawer === 'settings';

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
          style={mapStyle}
          hideActiveMarker={elevationWidgetActive || settingsDrawerActive}
          setActiveIndexRef={setActiveIndexRef}
          fitInitialBoundsRef={fitInitialBoundsRef}
          setIsAtInitialBounds={setIsAtInitialBounds}
        />
      </div>
      <ElevationGraph
        elevations={elevations}
        setActiveIndexRef={setActiveIndexRef}
        isExpanded={elevationWidgetActive}
      />
      <RouteOverlay
        {...routeOverlayState}
        coordinates={coordinates}
        elevations={elevations}
        runRouteRef={runRouteRef}
        isAtInitialBounds={isAtInitialBounds}
        mapStyle={mapStyle}
        onFitInitialBounds={handleFitInitialBounds}
        onMapStyleChange={setMapStyle}
      />
    </div>
  );
};

export type { RunRouteProps };
