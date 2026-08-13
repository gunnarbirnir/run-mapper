import {
  type RefObject,
  useEffect,
  type MutableRefObject,
  useRef,
} from 'react';
import type { Map } from 'mapbox-gl';

import type { BoundingBox, Bounds, Coordinates } from '~/types';
import { FIT_BOUNDS_CONFIG } from '~/constants/map';
import { getBoundingBox } from '~/utils/route';
import { formatBounds, isSameBounds } from '~/utils/map';

interface UseFitToInitialBoundsProps {
  isMapLoaded: boolean;
  initialBounds: Bounds;
  activeRouteBoundingBox?: BoundingBox;
  activeRouteCoordinates: Coordinates[];
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  mapRef: RefObject<Map>;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

// Implements functionality of fit to bounds button
export const useFitToInitialBounds = ({
  isMapLoaded,
  initialBounds,
  activeRouteBoundingBox,
  activeRouteCoordinates,
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
      activeRouteCoordinates.length > 0
        ? formatBounds(
            activeRouteBoundingBox || getBoundingBox(activeRouteCoordinates),
          )
        : initialBounds;

    if (
      activeBoundsRef.current &&
      !isSameBounds(activeBoundsRef.current, activeBounds)
    ) {
      setIsAtInitialBounds(false);
    }
    activeBoundsRef.current = activeBounds;

    fitToInitialBoundsRef.current = () => {
      mapRef.current?.fitBounds(activeBounds, { ...FIT_BOUNDS_CONFIG });
      isResettingBoundsRef.current = true;
    };

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [
    isMapLoaded,
    initialBounds,
    activeRouteBoundingBox,
    activeRouteCoordinates,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  ]);
};
