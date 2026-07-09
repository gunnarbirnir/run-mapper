import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useMemo, useRef } from 'react';

import { formatBounds } from '~/utils/map';

import { PoweredByLabel } from './components/PoweredByLabel';
import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { useActiveMarker } from './hooks/useActiveMarker';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapHotKeys } from './hooks/useMapHotKeys';
import { useMapRoute } from './hooks/useMapRoute';
import { useMapState } from './hooks/useMapState';
import { useMapStyle } from './hooks/useMapStyle';
import { useWaypoints } from './hooks/useWaypoints';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import type { RouteMapProps } from './types';

// Can be moved into PublicRunDisplay folder
export const RunRouteMap = ({
  routeId,
  runSlug,
  boundingBox,
  coordinates,
  waypoints,
  pointsOfInterest,
  elevations,
  activeWaypoint,
  activePointOfInterest,
  hideActiveMarker = false,
  routeIsAnimating,
  isMapLoaded,
  isAtInitialBounds,
  isFullscreen,
  setActiveIndexRef,
  animateRouteRef,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
  settings: { mapStyle, showWaypoints, showPointsOfInterest },
  setIsMapLoaded,
  setIsAtInitialBounds,
  setRouteIsAnimating,
  onWaypointClick,
  onPointOfInterestClick,
  onReset,
  animateRoute,
  fitToInitialBounds,
}: RouteMapProps) => {
  const bounds = useMemo(() => formatBounds(boundingBox), [boundingBox]);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useLoadMap({
    bounds,
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

  usePointsOfInterest({
    isMapLoaded,
    pointsOfInterest,
    showPointsOfInterest,
    activePointOfInterest,
    activeWaypoint,
    onPointOfInterestClick,
    fitToInitialBounds,
    mapRef,
  });

  useWaypoints({
    isMapLoaded,
    activeWaypoint,
    coordinates,
    waypoints,
    activePointOfInterest,
    showWaypoints,
    onWaypointClick,
    mapRef,
    fitToInitialBounds,
  });

  useFitToInitialBounds({
    isMapLoaded,
    bounds,
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
      <ActionButtonsContainer
        isMapLoaded={isMapLoaded}
        isAtInitialBounds={isAtInitialBounds}
        isFullscreen={isFullscreen}
        resetRoute={resetRoute}
        openFullscreen={openFullscreen}
        mapRef={mapRef}
      />
      <PoweredByLabel />
    </div>
  );
};

export { useMapState };
