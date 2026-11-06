import { type RefObject, useEffect, type MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import type { Bounds } from '~/types';
import { FIT_BOUNDS_CONFIG } from '~/constants/map';

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
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;

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
      mapRef.current?.fitBounds(bounds, FIT_BOUNDS_CONFIG);
      isResettingBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
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
