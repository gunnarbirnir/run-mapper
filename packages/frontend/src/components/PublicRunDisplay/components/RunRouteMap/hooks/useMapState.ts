import { useCallback, useRef, useState } from 'react';

export const useMapState = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [routeIsAnimating, setRouteIsAnimating] = useState(false);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const animateRouteRef = useRef<(() => void) | null>(null);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);
  const isResettingBoundsRef = useRef(false);

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
    setActiveMarkerIndex,
    fitToInitialBounds,
  };
};

export type MapState = ReturnType<typeof useMapState>;
