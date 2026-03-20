import { useCallback, useRef, useState } from 'react';

import type { MapStyle } from '~/types';

import type { MapState } from '../types';

export const useMapState = (): MapState => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [routeIsAnimating, setRouteIsAnimating] = useState(false);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const animateRouteRef = useRef<(() => void) | null>(null);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);
  const isResettingBoundsRef = useRef(false);

  const toggleShowWaypoints = useCallback(() => {
    setShowWaypoints((currentShowWaypoints) => !currentShowWaypoints);
  }, [setShowWaypoints]);

  const animateRoute = useCallback(() => {
    animateRouteRef.current?.();
  }, [animateRouteRef]);

  const setActiveMarkerIndex = useCallback(
    (updatedIndex: number | null) => {
      setActiveIndexRef.current?.(updatedIndex);
    },
    [setActiveIndexRef],
  );

  const fitToInitialBounds = useCallback(() => {
    fitToInitialBoundsRef.current?.();
  }, [fitToInitialBoundsRef]);

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
    fitToInitialBoundsRef,
    isResettingBoundsRef,
    animateRoute,
    toggleShowWaypoints,
    setActiveMarkerIndex,
    fitToInitialBounds,
  };
};
