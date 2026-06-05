import type { Map } from 'mapbox-gl';
import { RefObject, useEffect } from 'react';

interface UseResizeMapProps {
  isAnyPanelAnimating: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

export const useResizeMap = ({
  isAnyPanelAnimating,
  isMapLoaded,
  mapRef,
}: UseResizeMapProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isAnyPanelAnimating) {
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
  }, [isMapLoaded, isAnyPanelAnimating, mapRef]);
};
