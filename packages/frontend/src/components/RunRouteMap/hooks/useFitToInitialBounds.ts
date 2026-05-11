import { type RefObject, useEffect, type MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import type { Bounds } from '~/types';
import { FIT_INITIAL_BOUNDS_DURATION } from '~/constants/map';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  paddedBounds: Bounds;
  mapRef: RefObject<Map>;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useFitToInitialBounds = ({
  isMapLoaded,
  paddedBounds,
  mapRef,
  setIsAtInitialBounds,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
}: UseFitToInitialBoundsProps) => {
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapLoaded || !map) {
      return;
    }

    const handleMoveEnd = () => {
      if (isResettingBoundsRef.current) {
        isResettingBoundsRef.current = false;
        setIsAtInitialBounds(true);
      } else {
        setIsAtInitialBounds(false);
      }
    };

    map.on('moveend', handleMoveEnd);

    fitToInitialBoundsRef.current = () => {
      mapRef.current?.fitBounds(paddedBounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
      });
      isResettingBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
      isResettingBoundsRef.current = false;
    };
  }, [
    isMapLoaded,
    paddedBounds,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  ]);
};
