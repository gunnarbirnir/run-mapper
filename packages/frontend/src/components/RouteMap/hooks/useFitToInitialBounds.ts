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
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    // Initially at initial bounds
    setIsAtInitialBounds(true);

    mapRef.current.on('moveend', () => {
      if (hasClickedFitInitialBoundsRef.current) {
        hasClickedFitInitialBoundsRef.current = false;
        setIsAtInitialBounds(true);
      } else {
        setIsAtInitialBounds(false);
      }
    });

    fitInitialBoundsRef.current = () => {
      mapRef.current?.fitBounds(paddedBounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
      });
      hasClickedFitInitialBoundsRef.current = true;
    };

    return () => {
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
