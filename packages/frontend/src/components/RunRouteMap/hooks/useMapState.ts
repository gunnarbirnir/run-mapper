import { useCallback, useRef, useState } from 'react';

import type { MapState } from '../types';

export const useMapState = (): MapState => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [routeIsAnimating, setRouteIsAnimating] = useState(false);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const animateRouteRef = useRef<(() => void) | null>(null);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);
  const isResettingBoundsRef = useRef(false);

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
    isMapLoaded,
    isAtInitialBounds,
    routeIsAnimating,
    setIsMapLoaded,
    setIsAtInitialBounds,
    setRouteIsAnimating,
    animateRouteRef,
    setActiveIndexRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
    animateRoute,
    setActiveMarkerIndex,
    fitToInitialBounds,
  };
};
