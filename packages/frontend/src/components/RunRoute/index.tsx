import { lazy, Suspense, useMemo, useRef } from 'react';
import { RouteMap, useMapState } from '~/components/RouteMap';

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
  const runRouteRef = useRef<HTMLDivElement>(null);
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

  const mapState = useMapState();
  const {
    mapStyle,
    showWaypoints,
    isAtInitialBounds,
    routeIsAnimating,
    setActiveIndexRef,
    setMapStyle,
    animateRoute,
    toggleShowWaypoints,
    handleSetActiveWaypoint,
    handleFitInitialBounds,
  } = mapState;
  const { setActiveWaypoint, ...routeOverlayState } = useRouteOverlayState();
  const { activeWidget, activeDrawer } = routeOverlayState;
  const elevationWidgetActive = activeWidget === 'elevation';
  const anyDrawerActive = Boolean(activeDrawer);

  return (
    <div className="isolate flex h-full w-full flex-col" ref={runRouteRef}>
      <div className="flex-1">
        <RouteMap
          {...mapState}
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          elevations={elevations}
          hideActiveMarker={elevationWidgetActive || anyDrawerActive}
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
        routeIsAnimating={routeIsAnimating}
        animateRoute={animateRoute}
        fitInitialBounds={handleFitInitialBounds}
        setActiveWaypoint={handleSetActiveWaypoint}
        toggleShowWaypoints={toggleShowWaypoints}
        onMapStyleChange={setMapStyle}
      />
    </div>
  );
};

export type { RunRouteProps };
