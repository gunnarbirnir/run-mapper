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
  const { route, setRoute: setActiveRoute } = useRoute({ run, routeId });
  const publicRunDisplayRef = useRef<HTMLDivElement>(null);
  const { coordinates, elevations } = useMemo(
    () => processRunRoute(route.coordinates),
    [route.coordinates],
  );
  const waypoints = useMemo(() => route.waypoints, [route.waypoints]);

  const mapState = useMapState(coordinates);
  const {
    mapStyle,
    showWaypoints,
    routeIsAnimating,
    setActiveIndexRef,
    setMapStyle,
    toggleShowWaypoints,
    handleSetActiveWaypoint,
  } = mapState;
  const { setActiveWaypoint, ...routeOverlayState } = useRouteOverlayState();
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
          isFullscreen={isFullscreen}
          boundingBox={route.boundingBox}
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
        routes={run.routes}
        routeId={route.id}
        coordinates={coordinates}
        elevations={elevations}
        waypoints={waypoints}
        publicRunDisplayRef={publicRunDisplayRef}
        mapStyle={mapStyle}
        showWaypoints={showWaypoints}
        setActiveWaypoint={handleSetActiveWaypoint}
        toggleShowWaypoints={toggleShowWaypoints}
        onMapStyleChange={setMapStyle}
        setActiveRoute={setActiveRoute}
      />
    </div>
  );
};

export type { PublicRunDisplayProps };
