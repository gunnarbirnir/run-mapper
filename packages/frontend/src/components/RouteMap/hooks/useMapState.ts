import { useState, useRef, useCallback } from 'react';

import type { MapStyle, Waypoint } from '~/types';

import type { MapState } from '../types';

export const useMapState = (): MapState => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const animateRouteRef = useRef<(() => void) | null>(null);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);
  const setActiveWaypointRef = useRef<((waypoint: Waypoint) => void) | null>(
    null,
  );
  const fitInitialBoundsRef = useRef<(() => void) | null>(null);

  const animateRoute = useCallback(() => {
    animateRouteRef.current?.();
  }, [animateRouteRef]);
  const toggleShowWaypoints = useCallback(() => {
    setShowWaypoints((currentShowWaypoints) => !currentShowWaypoints);
  }, [setShowWaypoints]);
  const handleSetActiveWaypoint = useCallback(
    (waypoint: Waypoint) => {
      setActiveWaypointRef.current?.(waypoint);
    },
    [setActiveWaypointRef],
  );
  const handleFitInitialBounds = useCallback(() => {
    fitInitialBoundsRef.current?.();
  }, [fitInitialBoundsRef]);

  return {
    mapStyle,
    showWaypoints,
    isAtInitialBounds,
    setMapStyle,
    setShowWaypoints,
    setIsAtInitialBounds,
    animateRouteRef,
    setActiveIndexRef,
    setActiveWaypointRef,
    fitInitialBoundsRef,
    animateRoute,
    toggleShowWaypoints,
    handleSetActiveWaypoint,
    handleFitInitialBounds,
  };
};
