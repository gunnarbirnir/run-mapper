import {
  type RefObject,
  useEffect,
  useRef,
  type MutableRefObject,
} from 'react';
import type { Map } from 'mapbox-gl';

import type { Bounds } from '~/types';

import { FIT_INITIAL_BOUNDS_DURATION } from '../constants';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  paddedBounds: Bounds;
  mapRef: RefObject<Map>;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
}

export const useFitToInitialBounds = ({
  isMapLoaded,
  paddedBounds,
  mapRef,
  setIsAtInitialBounds,
  fitToInitialBoundsRef,
}: UseFitToInitialBoundsProps) => {
  const hasClickedFitInitialBoundsRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapLoaded || !map) {
      return;
    }

    // Initially at initial bounds
    setIsAtInitialBounds(true);

    const handleMoveEnd = () => {
      if (hasClickedFitInitialBoundsRef.current) {
        hasClickedFitInitialBoundsRef.current = false;
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
      hasClickedFitInitialBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
      hasClickedFitInitialBoundsRef.current = false;
    };
  }, [
    isMapLoaded,
    paddedBounds,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
  ]);
};
