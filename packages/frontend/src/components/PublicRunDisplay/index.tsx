import { lazy, Suspense, useMemo, useRef } from 'react';
import { RunRouteMap, useMapState } from '~/components/RunRouteMap';

import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import {
  PUBLIC_RUN_DISPLAY_MIN_WIDTH,
  PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
} from '~/constants';
import { cn } from '~/utils';
import { useRoute } from '~/hooks/useRoute';

import type { PublicRunDisplayProps } from './types';
import { processRunRoute } from './utils';
import { RouteOverlay, useRouteOverlayState } from './RouteOverlay';

// Lazy load to fix SSR issue
const ElevationGraph = lazy(() =>
  import('~/components/ElevationGraph').then((m) => ({
    default: m.ElevationGraph,
  })),
);

export const PublicRunDisplay = ({
  run,
  routeId,
  isFullscreen = false,
}: PublicRunDisplayProps) => {
  const { route, setRoute: setActiveRoute } = useRoute({
    run,
    routeId,
    isFullscreen,
  });
  const publicRunDisplayRef = useRef<HTMLDivElement>(null);
  const { coordinates, elevations } = useMemo(
    () => processRunRoute(route.coordinates),
    [route.coordinates],
  );
  const waypoints = useMemo(() => route.waypoints, [route.waypoints]);

  const mapState = useMapState();
  const {
    mapStyle,
    showWaypoints,
    routeIsAnimating,
    setMapStyle,
    toggleShowWaypoints,
    setActiveMarkerIndex,
  } = mapState;
  const routeOverlayState = useRouteOverlayState();
  const { activeWaypoint, setActiveWaypoint, resetState } = routeOverlayState;
  const { compactHeight: graphHeight } = useElevationGraphHeight();
  const { activeWidget, activeDrawer } = routeOverlayState;
  const elevationWidgetActive = activeWidget === 'elevation';
  const anyDrawerActive = Boolean(activeDrawer);

  return (
    <div
      className={cn('relative isolate flex h-full w-full flex-col', {
        fixed: isFullscreen,
      })}
      style={{
        minHeight: PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
        minWidth: PUBLIC_RUN_DISPLAY_MIN_WIDTH,
      }}
      ref={publicRunDisplayRef}
    >
      <div className="flex-1">
        <RunRouteMap
          {...mapState}
          routeId={route.id}
          runSlug={run.publicSlug}
          isFullscreen={isFullscreen}
          boundingBox={route.boundingBox}
          coordinates={coordinates}
          waypoints={waypoints}
          elevations={elevations}
          activeWaypoint={activeWaypoint}
          hideActiveMarker={
            elevationWidgetActive || anyDrawerActive || routeIsAnimating
          }
          onWaypointClick={setActiveWaypoint}
          resetOverlayState={resetState}
        />
      </div>
      <Suspense
        fallback={
          <div className="w-full bg-gray-50" style={{ height: graphHeight }} />
        }
      >
        <ElevationGraph
          elevations={elevations}
          isExpanded={elevationWidgetActive}
          isTooltipActive={!anyDrawerActive}
          setActiveMarkerIndex={setActiveMarkerIndex}
        />
      </Suspense>
      <RouteOverlay
        {...routeOverlayState}
        routes={run.routes}
        routeId={route.id}
        coordinates={coordinates}
        elevations={elevations}
        waypoints={waypoints}
        publicRunDisplayRef={publicRunDisplayRef}
        mapStyle={mapStyle}
        showWaypoints={showWaypoints}
        toggleShowWaypoints={toggleShowWaypoints}
        onMapStyleChange={setMapStyle}
        setActiveRoute={setActiveRoute}
      />
    </div>
  );
};

export type { PublicRunDisplayProps };
