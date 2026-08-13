import { Map } from 'mapbox-gl';
import { MutableRefObject, RefObject, useEffect } from 'react';

import { FIT_BOUNDS_CONFIG } from '~/constants/map';
import { Bounds } from '~/types';

interface UseResetBoundsProps {
  isMapLoaded: boolean;
  initialBounds: Bounds;
  isAnyPanelAnimating: boolean;
  routePanelIsOpen: boolean;
  pointOfInterestPanelIsOpen: boolean;
  waypointPanelIsOpen: boolean;
  mapRef: RefObject<Map>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

// Reset to initial bounds when all panels (except root) are closed
export const useResetBounds = ({
  isMapLoaded,
  initialBounds,
  isAnyPanelAnimating,
  routePanelIsOpen,
  pointOfInterestPanelIsOpen,
  waypointPanelIsOpen,
  mapRef,
  isResettingBoundsRef,
}: UseResetBoundsProps) => {
  useEffect(() => {
    if (
      !isMapLoaded ||
      !mapRef.current ||
      isAnyPanelAnimating ||
      routePanelIsOpen ||
      pointOfInterestPanelIsOpen ||
      waypointPanelIsOpen
    ) {
      return;
    }

    mapRef.current.fitBounds(initialBounds, { ...FIT_BOUNDS_CONFIG });
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
