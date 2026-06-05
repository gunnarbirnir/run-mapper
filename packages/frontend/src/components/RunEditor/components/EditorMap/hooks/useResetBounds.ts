import { RefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';

import { Bounds } from '~/types';
import { BOUNDS_PADDING, FIT_INITIAL_BOUNDS_DURATION } from '~/constants/map';

interface UseResetBoundsProps {
  initialBounds?: Bounds;
  isAnyPanelAnimating: boolean;
  routePanelIsOpen: boolean;
  pointOfInterestPanelIsOpen: boolean;
  waypointPanelIsOpen: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

export const useResetBounds = ({
  initialBounds,
  isAnyPanelAnimating,
  routePanelIsOpen,
  pointOfInterestPanelIsOpen,
  waypointPanelIsOpen,
  isMapLoaded,
  mapRef,
}: UseResetBoundsProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isAnyPanelAnimating) {
      return;
    }

    if (
      !initialBounds ||
      routePanelIsOpen ||
      pointOfInterestPanelIsOpen ||
      waypointPanelIsOpen
    ) {
      return;
    }

    mapRef.current.fitBounds(initialBounds, {
      padding: BOUNDS_PADDING,
      duration: FIT_INITIAL_BOUNDS_DURATION,
    });
  }, [
    isMapLoaded,
    initialBounds,
    isAnyPanelAnimating,
    routePanelIsOpen,
    pointOfInterestPanelIsOpen,
    waypointPanelIsOpen,
    mapRef,
  ]);
};
