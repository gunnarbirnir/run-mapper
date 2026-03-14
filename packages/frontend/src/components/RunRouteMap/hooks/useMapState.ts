import { useState, useRef, useCallback, useEffect } from 'react';

import type { Coordinates, MapStyle, Waypoint } from '~/types';

import type { MapState } from '../types';
import { getRouteAnimationDuration } from '../utils';

export const useMapState = (coordinates: Coordinates[]): MapState => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [routeIsAnimating, setRouteIsAnimating] = useState(false);
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

  useEffect(() => {
    if (!routeIsAnimating) {
      return;
    }

    const animationTimeout = setTimeout(() => {
      setRouteIsAnimating(false);
    }, getRouteAnimationDuration(coordinates));

    return () => {
      clearTimeout(animationTimeout);
      setRouteIsAnimating(false);
    };
  }, [routeIsAnimating, coordinates]);

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

  const animateRoute = useCallback(() => {
    handleFitInitialBounds();
    animateRouteRef.current?.();
  }, [animateRouteRef, handleFitInitialBounds]);

  return {
    mapStyle,
    showWaypoints,
    isAtInitialBounds,
    routeIsAnimating,
    setMapStyle,
    setShowWaypoints,
    setIsAtInitialBounds,
    setRouteIsAnimating,
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
