import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef, useState } from 'react';

import { Icon } from '~/primitives';

import { useActiveMarker } from './hooks/useActiveMarker';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapState } from './hooks/useMapState';
import { useMapStyle } from './hooks/useMapStyle';
import { useMapRoute } from './hooks/useMapRoute';
import { useWaypoints } from './hooks/useWaypoints';
import type { RouteMapProps } from './types';
import { getPaddedBounds } from './utils';
import { PoweredByLabel } from './components/PoweredByLabel';
import { MapActionButton } from './components/MapActionButton';

export const RunRouteMap = ({
  routeId,
  runSlug,
  boundingBox,
  coordinates,
  waypoints,
  elevations,
  mapStyle,
  hideActiveMarker = false,
  showWaypoints = true,
  routeIsAnimating,
  isAtInitialBounds,
  isFullscreen,
  setActiveIndexRef,
  fitInitialBoundsRef,
  setActiveWaypointRef,
  animateRouteRef,
  animateRoute,
  setIsAtInitialBounds,
  onWaypointClick,
  setRouteIsAnimating,
  handleFitInitialBounds,
}: RouteMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
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
    coordinates,
    waypoints,
    showWaypoints,
    onWaypointClick,
    mapRef,
    setActiveWaypointRef,
  });

  useFitToInitialBounds({
    isMapLoaded,
    paddedBounds,
    setIsAtInitialBounds,
    mapRef,
    fitInitialBoundsRef,
  });

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <MapActionButton
        index={mapActionButtonIndex++}
        disabled={routeIsAnimating}
        onClick={animateRoute}
      >
        <Icon name="play" className="size-5" />
      </MapActionButton>
      <MapActionButton
        index={mapActionButtonIndex++}
        disabled={isAtInitialBounds}
        onClick={handleFitInitialBounds}
      >
        <Icon name="reset" className="size-5" />
      </MapActionButton>
      {!isFullscreen && (
        <MapActionButton
          index={mapActionButtonIndex++}
          onClick={() =>
            window.open(
              `/run/${runSlug}?isFullscreen=true&routeId=${routeId}`,
              '_blank',
            )
          }
        >
          <Icon name="externalLink" className="size-5" />
        </MapActionButton>
      )}
      <PoweredByLabel />
    </div>
  );
};

export { useMapState };
