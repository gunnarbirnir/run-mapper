import {
  type RefObject,
  type MutableRefObject,
  useEffect,
  useRef,
} from 'react';
import type { Map } from 'mapbox-gl';

import type { Bounds } from '~/types';

import { FIT_INITIAL_BOUNDS_DURATION } from '../constants';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  paddedBounds: Bounds;
  mapRef: RefObject<Map>;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  fitInitialBoundsRef: MutableRefObject<(() => void) | null>;
}

export const useFitToInitialBounds = ({
  isMapLoaded,
  paddedBounds,
  setIsAtInitialBounds,
  mapRef,
  fitInitialBoundsRef,
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

    fitInitialBoundsRef.current = () => {
      map.fitBounds(paddedBounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
      });
      hasClickedFitInitialBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
      fitInitialBoundsRef.current = null;
      hasClickedFitInitialBoundsRef.current = false;
    };
  }, [
    isMapLoaded,
    paddedBounds,
    setIsAtInitialBounds,
    mapRef,
    fitInitialBoundsRef,
  ]);
};
