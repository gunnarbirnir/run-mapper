import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useMemo, useRef } from 'react';

import { formatBounds } from '~/utils/map';
import { getRunBasePath } from '~/utils';
import { DEFAULT_MAP_BOUNDS } from '~/constants/map';

import { PoweredByLabel } from './components/PoweredByLabel';
import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { useActiveMarker } from './hooks/useActiveMarker';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapRoute } from './hooks/useMapRoute';
import { useMapState } from './hooks/useMapState';
import { useMapStyle } from './hooks/useMapStyle';
import { useWaypoints } from './hooks/useWaypoints';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import type { RouteMapProps } from './types';

export const RunRouteMap = ({
  runId,
  runSlug,
  isFullscreen,
  isPreview,
  route,
  pointsOfInterest,
  activeWaypoint,
  activePointOfInterest,
  hideActiveMarker = false,
  settings: { mapStyle, showWaypoints, showPointsOfInterest },
  routeIsAnimating,
  isMapLoaded,
  isAtInitialBounds,
  setActiveIndexRef,
  animateRouteRef,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
  setIsMapLoaded,
  setIsAtInitialBounds,
  setRouteIsAnimating,
  onWaypointClick,
  onPointOfInterestClick,
  onReset,
  fitToInitialBounds,
}: RouteMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const routeId = useMemo(() => route?.id, [route?.id]);
  const coordinates = useMemo(
    () => route?.coordinates ?? [],
    [route?.coordinates],
  );
  const bounds = useMemo(
    () =>
      route?.boundingBox
        ? formatBounds(route?.boundingBox)
        : DEFAULT_MAP_BOUNDS,
    [route?.boundingBox],
  );
  const waypoints = useMemo(() => route?.waypoints ?? [], [route?.waypoints]);

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

  useFitToInitialBounds({
    isMapLoaded,
    bounds,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  });

  useMapRoute({
    isMapLoaded,
    coordinates,
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

  const resetRoute = useCallback(() => {
    fitToInitialBounds();
    onReset();
  }, [fitToInitialBounds, onReset]);

  const openFullscreen = useCallback(() => {
    const basePath = getRunBasePath(
      { id: runId, publicSlug: runSlug },
      isPreview,
    );
    window.open(
      `${basePath}?isFullscreen=true${routeId ? `&routeId=${routeId}` : ''}`,
      '_blank',
    );
  }, [runId, runSlug, routeId, isPreview]);

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
