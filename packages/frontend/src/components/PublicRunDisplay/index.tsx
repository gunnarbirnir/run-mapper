import { lazy, Suspense, useMemo, useRef } from 'react';
import { RunRouteMap, useMapState } from '~/components/RunRouteMap';

import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import {
  PUBLIC_RUN_DISPLAY_MIN_WIDTH,
  PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
} from '~/constants';
import { cn } from '~/utils';

import { useRoute } from './hooks/useRoute';
import { useRunDisplayState } from './hooks/useRunDisplayState';
import { useSettings } from './hooks/useSettings';
import type { PublicRunDisplayProps } from './types';
import { processRunRoute } from './utils';
import { RouteOverlay } from './components/RouteOverlay';

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

  const runDisplayState = useRunDisplayState();
  const {
    activeWaypoint,
    activePointOfInterest,
    activeWidget,
    activeDrawer,
    setActiveWaypoint,
    setActivePointOfInterest,
    resetState,
  } = runDisplayState;
  const settings = useSettings();
  const mapState = useMapState();
  const { routeIsAnimating, setActiveMarkerIndex } = mapState;
  const { compactHeight: graphHeight } = useElevationGraphHeight();
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
          waypoints={route.waypoints}
          pointsOfInterest={run.pointsOfInterest}
          elevations={elevations}
          activeWaypoint={activeWaypoint}
          activePointOfInterest={activePointOfInterest}
          hideActiveMarker={
            elevationWidgetActive || anyDrawerActive || routeIsAnimating
          }
          settings={settings}
          onWaypointClick={setActiveWaypoint}
          onPointOfInterestClick={setActivePointOfInterest}
          onReset={resetState}
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
          onActiveIndexChange={setActiveMarkerIndex}
        />
      </Suspense>
      <RouteOverlay
        {...runDisplayState}
        routes={run.routes}
        routeId={route.id}
        coordinates={coordinates}
        elevations={elevations}
        waypoints={route.waypoints}
        publicRunDisplayRef={publicRunDisplayRef}
        settings={settings}
        setActiveRoute={setActiveRoute}
      />
    </div>
  );
};

export type { PublicRunDisplayProps };
