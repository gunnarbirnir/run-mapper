import {
  type RefObject,
  useEffect,
  type MutableRefObject,
  useRef,
} from 'react';
import type { Map } from 'mapbox-gl';

import type { BoundingBox, Bounds, Coordinates } from '~/types';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';
import { getBoundingBox } from '~/utils/route';
import { formatBounds, isSameBounds } from '~/utils/map';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  initialBounds: Bounds;
  routeBoundingBox?: BoundingBox;
  routeCoordinates: Coordinates[];
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  mapRef: RefObject<Map>;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useFitToInitialBounds = ({
  isMapLoaded,
  initialBounds,
  routeBoundingBox,
  routeCoordinates,
  mapRef,
  setIsAtInitialBounds,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
}: UseFitToInitialBoundsProps) => {
  const activeBoundsRef = useRef<Bounds | undefined>(undefined);

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

    const activeBounds =
      routeCoordinates.length > 0
        ? formatBounds(routeBoundingBox || getBoundingBox(routeCoordinates))
        : initialBounds;

    if (
      activeBoundsRef.current &&
      !isSameBounds(activeBoundsRef.current, activeBounds)
    ) {
      setIsAtInitialBounds(false);
    }
    activeBoundsRef.current = activeBounds;

    fitToInitialBoundsRef.current = () => {
      mapRef.current?.fitBounds(activeBounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
        padding: BOUNDS_PADDING,
      });
      isResettingBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [
    isMapLoaded,
    initialBounds,
    routeBoundingBox,
    routeCoordinates,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  ]);
};
