import { lazy, Suspense, useMemo, useRef } from 'react';
import { RunRouteMap, useMapState } from '~/components/RunRouteMap';

import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import {
  PUBLIC_RUN_DISPLAY_MIN_WIDTH,
  PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
} from '~/constants';

import type { PublicRunDisplayProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';
import { RouteOverlay, useRouteOverlayState } from './RouteOverlay';

// Lazy load to fix SSR issue
const ElevationGraph = lazy(() =>
  import('~/components/ElevationGraph').then((m) => ({
    default: m.ElevationGraph,
  })),
);

export const PublicRunDisplay = ({
  routeId,
  run,
  isFullscreen = false,
}: PublicRunDisplayProps) => {
  const publicRunDisplayRef = useRef<HTMLDivElement>(null);
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
  const { compactHeight: graphHeight } = useElevationGraphHeight();
  const { activeWidget, activeDrawer } = routeOverlayState;
  const elevationWidgetActive = activeWidget === 'elevation';
  const anyDrawerActive = Boolean(activeDrawer);

  return (
    <div
      className="relative isolate flex h-full w-full flex-col"
      style={{
        minHeight: PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
        minWidth: PUBLIC_RUN_DISPLAY_MIN_WIDTH,
      }}
      ref={publicRunDisplayRef}
    >
      <div className="flex-1">
        <RunRouteMap
          {...mapState}
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          elevations={elevations}
          hideActiveMarker={
            elevationWidgetActive || anyDrawerActive || routeIsAnimating
          }
          onWaypointClick={setActiveWaypoint}
        />
      </div>
      <Suspense
        fallback={
          <div className="w-full bg-gray-50" style={{ height: graphHeight }} />
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
        routeId={routeId}
        isFullscreen={isFullscreen}
        coordinates={coordinates}
        elevations={elevations}
        waypoints={waypoints}
        publicRunDisplayRef={publicRunDisplayRef}
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

export type { PublicRunDisplayProps };
