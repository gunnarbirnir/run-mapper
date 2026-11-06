import { useRef } from 'react';

import {
  PUBLIC_RUN_DISPLAY_MIN_WIDTH,
  PUBLIC_RUN_DISPLAY_MIN_HEIGHT,
} from '~/constants';
import { cn } from '~/utils';
import { IdProvider } from '~/context/IdContext';

import { useRoute } from './hooks/useRoute';
import { useRunDisplayState } from './hooks/useRunDisplayState';
import { useSettings } from './hooks/useSettings';
import type { PublicRunDisplayProps } from './types';
import { RunRouteMap, useMapState } from './components/RunRouteMap';
// import { RouteOverlay } from './components/RouteOverlay';
// import { ElevationGraph } from '../ElevationGraph';

export const PublicRunDisplay = ({
  run,
  initialRouteId,
  isFullscreen = false,
  isPreview = false,
}: PublicRunDisplayProps) => {
  const { route /* , setRoute: setActiveRoute */ } = useRoute({
    run,
    initialRouteId,
    isFullscreen,
    isPreview,
  });
  const publicRunDisplayRef = useRef<HTMLDivElement>(null);
  const runDisplayState = useRunDisplayState(route?.id);
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
  const { routeIsAnimating /* , setActiveMarkerIndex */ } = mapState;
  const elevationWidgetActive = activeWidget === 'elevation';
  const anyDrawerActive = Boolean(activeDrawer);

  return (
    <IdProvider baseId="public-run">
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
            runId={run.id}
            runSlug={run.publicSlug}
            isFullscreen={isFullscreen}
            isPreview={isPreview}
            route={route}
            pointsOfInterest={run.pointsOfInterest}
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
        {/* <ElevationGraph
          elevations={elevations}
          isExpanded={elevationWidgetActive}
          isTooltipActive={!anyDrawerActive}
          onActiveIndexChange={setActiveMarkerIndex}
        /> */}
        {/* <RouteOverlay
          {...runDisplayState}
          routes={run.routes}
          routeId={route.id}
          coordinates={coordinates}
          elevations={elevations}
          waypoints={route.waypoints}
          pointsOfInterest={run.pointsOfInterest}
          publicRunDisplayRef={publicRunDisplayRef}
          settings={settings}
          setActiveRoute={setActiveRoute}
        /> */}
      </div>
    </IdProvider>
  );
};

export type { PublicRunDisplayProps };
