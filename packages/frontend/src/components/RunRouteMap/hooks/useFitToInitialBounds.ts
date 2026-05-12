import { type RefObject, useEffect, type MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import type { Bounds } from '~/types';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  bounds: Bounds;
  mapRef: RefObject<Map>;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useFitToInitialBounds = ({
  isMapLoaded,
  bounds,
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
      mapRef.current?.fitBounds(bounds, {
        padding: BOUNDS_PADDING,
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
    bounds,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  ]);
};
