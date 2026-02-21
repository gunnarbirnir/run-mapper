import { lazy, Suspense, useCallback, useMemo, useRef } from 'react';
import { RouteMap, useMapState } from '~/components/RouteMap';
import type { Waypoint } from '~/types';

import { ELEVATION_GRAPH_HEIGHT } from '~/constants';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';
import { RouteOverlay, useRouteOverlayState } from './RouteOverlay';

// Lazy load to fix SSR issue
const ElevationGraph = lazy(() =>
  import('~/components/ElevationGraph').then((m) => ({
    default: m.ElevationGraph,
  })),
);

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
  const setActiveWaypointRef = useRef<((waypoint: Waypoint) => void) | null>(
    null,
  );

  const {
    style: mapStyle,
    isAtInitialBounds,
    showWaypoints,
    setStyle: setMapStyle,
    setIsAtInitialBounds,
    setShowWaypoints,
  } = useMapState();
  const routeOverlayState = useRouteOverlayState();
  const { activeWidget, activeDrawer, setActiveWaypoint } = routeOverlayState;
  const elevationWidgetActive = activeWidget === 'elevation';
  const anyDrawerActive = Boolean(activeDrawer);

  const handleFitInitialBounds = useCallback(() => {
    fitInitialBoundsRef.current?.();
  }, []);
  const handleSetActiveWaypoint = useCallback((waypoint: Waypoint) => {
    setActiveWaypointRef.current?.(waypoint);
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
          hideActiveMarker={elevationWidgetActive || anyDrawerActive}
          showWaypoints={showWaypoints}
          setActiveIndexRef={setActiveIndexRef}
          fitInitialBoundsRef={fitInitialBoundsRef}
          setActiveWaypointRef={setActiveWaypointRef}
          setIsAtInitialBounds={setIsAtInitialBounds}
          onWaypointClick={setActiveWaypoint}
        />
      </div>
      <Suspense
        fallback={
          <div
            className="w-full bg-gray-50"
            style={{ height: ELEVATION_GRAPH_HEIGHT }}
          />
        }
      >
        <ElevationGraph
          elevations={elevations}
          setActiveIndexRef={setActiveIndexRef}
          isExpanded={elevationWidgetActive}
          isTooltipActive={!anyDrawerActive}
        />
      </Suspense>
      <RouteOverlay
        {...routeOverlayState}
        coordinates={coordinates}
        elevations={elevations}
        waypoints={waypoints}
        runRouteRef={runRouteRef}
        isAtInitialBounds={isAtInitialBounds}
        mapStyle={mapStyle}
        showWaypoints={showWaypoints}
        onFitInitialBounds={handleFitInitialBounds}
        onMapStyleChange={setMapStyle}
        onSetActiveWaypoint={handleSetActiveWaypoint}
        toggleShowWaypoints={() =>
          setShowWaypoints((currentShowWaypoints) => !currentShowWaypoints)
        }
      />
    </div>
  );
};

export type { RunRouteProps };
