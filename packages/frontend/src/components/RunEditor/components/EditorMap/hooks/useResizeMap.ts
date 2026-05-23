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
  const isAnimating = [
    rootPanelIsAnimating,
    routePanelIsAnimating,
    pointOfInterestPanelIsAnimating,
    waypointPanelIsAnimating,
  ].some(Boolean);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isAnimating) {
      return;
    }

    let frameId: number;

    const resizeLoop = () => {
      mapRef.current?.resize();
      frameId = requestAnimationFrame(resizeLoop);
    };

    frameId = requestAnimationFrame(resizeLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isMapLoaded, isAnimating, mapRef]);
};
