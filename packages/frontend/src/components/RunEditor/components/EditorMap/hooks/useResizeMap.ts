import type { Map } from 'mapbox-gl';
import { RefObject, useEffect } from 'react';

interface UseResizeMapProps {
  rootPanelIsAnimating: boolean;
  routePanelIsAnimating: boolean;
  pointOfInterestPanelIsAnimating: boolean;
  waypointPanelIsAnimating: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

export const useResizeMap = ({
  rootPanelIsAnimating,
  routePanelIsAnimating,
  pointOfInterestPanelIsAnimating,
  waypointPanelIsAnimating,
  isMapLoaded,
  mapRef,
}: UseResizeMapProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    mapRef.current.resize();
  }, [
    rootPanelIsAnimating,
    routePanelIsAnimating,
    pointOfInterestPanelIsAnimating,
    waypointPanelIsAnimating,
    isMapLoaded,
    mapRef,
  ]);
};
