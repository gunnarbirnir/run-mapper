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

export const RouteMap = ({
  bounds,
  coordinates,
  waypoints,
  mapStyle,
  hideActiveMarker = false,
  showWaypoints = true,
  setActiveIndexRef,
  fitInitialBoundsRef,
  setActiveWaypointRef,
  setIsAtInitialBounds,
  onWaypointClick,
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
    mapRef,
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

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export { useMapState };
