import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef, useState } from 'react';

import { useActiveMarker } from './hooks/useActiveMarker';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapState } from './hooks/useMapState';
import { useMapStyle } from './hooks/useMapStyle';
import { useRoute } from './hooks/useRoute';
import { useWaypoints } from './hooks/useWaypoints';
import type { RouteMapProps } from './types';
import { getPaddedBounds } from './utils';
import { PoweredByLabel } from './components/PoweredByLabel';

export const RouteMap = ({
  bounds,
  coordinates,
  waypoints,
  elevations,
  mapStyle,
  hideActiveMarker = false,
  showWaypoints = true,
  setActiveIndexRef,
  fitInitialBoundsRef,
  setActiveWaypointRef,
  animateRouteRef,
  setIsAtInitialBounds,
  onWaypointClick,
  setRouteIsAnimating,
}: RouteMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const paddedBounds = useMemo(() => getPaddedBounds(bounds), [bounds]);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  useRoute({
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
      <PoweredByLabel />
    </div>
  );
};

export { useMapState };
