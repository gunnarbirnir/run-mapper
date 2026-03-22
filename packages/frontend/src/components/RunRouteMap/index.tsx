import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useMemo, useRef } from 'react';

import { Icon, Tooltip } from '~/primitives';

import { MapActionButton } from './components/MapActionButton';
import { PoweredByLabel } from './components/PoweredByLabel';
import { useActiveMarker } from './hooks/useActiveMarker';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapHotKeys } from './hooks/useMapHotKeys';
import { useMapRoute } from './hooks/useMapRoute';
import { useMapState } from './hooks/useMapState';
import { useMapStyle } from './hooks/useMapStyle';
import { useWaypoints } from './hooks/useWaypoints';
import type { RouteMapProps } from './types';
import { getPaddedBounds } from './utils';

export const RunRouteMap = ({
  routeId,
  runSlug,
  boundingBox,
  coordinates,
  waypoints,
  elevations,
  activeWaypoint,
  hideActiveMarker = false,
  routeIsAnimating,
  isMapLoaded,
  isAtInitialBounds,
  isFullscreen,
  setActiveIndexRef,
  animateRouteRef,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
  settings: { mapStyle, showWaypoints },
  setIsMapLoaded,
  setIsAtInitialBounds,
  setRouteIsAnimating,
  onWaypointClick,
  onReset,
  animateRoute,
  fitToInitialBounds,
}: RouteMapProps) => {
  const paddedBounds = useMemo(
    () => getPaddedBounds(boundingBox),
    [boundingBox],
  );
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  let mapActionButtonIndex = 0;

  useLoadMap({
    paddedBounds,
    mapStyle,
    setIsMapLoaded,
    mapRef,
    mapContainerRef,
    isResettingBoundsRef,
  });

  useMapStyle({
    isMapLoaded,
    mapRef,
    mapStyle,
  });

  useMapRoute({
    isMapLoaded,
    coordinates,
    elevations,
    routeIsAnimating,
    mapRef,
    animateRouteRef,
    setRouteIsAnimating,
  });

  useActiveMarker({
    isMapLoaded,
    coordinates,
    hideActiveMarker,
    mapRef,
    setActiveIndexRef,
  });

  useWaypoints({
    isMapLoaded,
    activeWaypoint,
    coordinates,
    waypoints,
    showWaypoints,
    onWaypointClick,
    mapRef,
    fitToInitialBounds,
  });

  useFitToInitialBounds({
    isMapLoaded,
    paddedBounds,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  });

  const playRoute = useCallback(() => {
    fitToInitialBounds();
    onReset();
    animateRoute();
  }, [fitToInitialBounds, onReset, animateRoute]);

  const resetRoute = useCallback(() => {
    fitToInitialBounds();
    onReset();
  }, [fitToInitialBounds, onReset]);

  const openFullscreen = useCallback(() => {
    window.open(
      `/run/${runSlug}?isFullscreen=true&routeId=${routeId}`,
      '_blank',
    );
  }, [runSlug, routeId]);

  useMapHotKeys({
    routeIsAnimating,
    isAtInitialBounds,
    isFullscreen,
    playRoute,
    resetRoute,
    openFullscreen,
  });

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <Tooltip.Provider>
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Play"
          disabled={routeIsAnimating}
          onClick={playRoute}
        >
          <Icon name="play" className="size-5" />
        </MapActionButton>
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Reset"
          disabled={isAtInitialBounds}
          onClick={resetRoute}
        >
          <Icon name="reset" className="size-4.5" />
        </MapActionButton>
        {!isFullscreen && (
          <MapActionButton
            index={mapActionButtonIndex++}
            tooltipLabel="Fullscreen"
            onClick={openFullscreen}
          >
            <Icon name="externalLink" className="size-5" />
          </MapActionButton>
        )}
      </Tooltip.Provider>
      <PoweredByLabel />
    </div>
  );
};

export { useMapState };
