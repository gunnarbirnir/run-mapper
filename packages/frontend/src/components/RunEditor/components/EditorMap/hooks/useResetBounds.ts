import { Map } from 'mapbox-gl';
import { MutableRefObject, RefObject, useEffect } from 'react';

import { BOUNDS_PADDING, FIT_INITIAL_BOUNDS_DURATION } from '~/constants/map';
import { Bounds } from '~/types';

interface UseResetBoundsProps {
  initialBounds: Bounds;
  isAnyPanelAnimating: boolean;
  routePanelIsOpen: boolean;
  pointOfInterestPanelIsOpen: boolean;
  waypointPanelIsOpen: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useResetBounds = ({
  initialBounds,
  isAnyPanelAnimating,
  routePanelIsOpen,
  pointOfInterestPanelIsOpen,
  waypointPanelIsOpen,
  isMapLoaded,
  mapRef,
  isResettingBoundsRef,
}: UseResetBoundsProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isAnyPanelAnimating) {
      return;
    }

    if (routePanelIsOpen || pointOfInterestPanelIsOpen || waypointPanelIsOpen) {
      return;
    }

    mapRef.current.fitBounds(initialBounds, {
      duration: FIT_INITIAL_BOUNDS_DURATION,
      padding: BOUNDS_PADDING,
    });
    isResettingBoundsRef.current = true;
  }, [
    isMapLoaded,
    initialBounds,
    isAnyPanelAnimating,
    routePanelIsOpen,
    pointOfInterestPanelIsOpen,
    waypointPanelIsOpen,
    mapRef,
    isResettingBoundsRef,
  ]);
};
