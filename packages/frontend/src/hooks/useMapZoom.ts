import type { Map } from 'mapbox-gl';
import { useCallback, useEffect, useState, type RefObject } from 'react';
// import { useHotkey } from '@tanstack/react-hotkeys';

interface UseMapZoomProps {
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

export const useMapZoom = ({ isMapLoaded, mapRef }: UseMapZoomProps) => {
  const [canZoomIn, setCanZoomIn] = useState(false);
  const [canZoomOut, setCanZoomOut] = useState(false);

  const zoomIn = useCallback(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    mapRef.current?.zoomIn();
  }, [isMapLoaded, mapRef]);

  const zoomOut = useCallback(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    mapRef.current?.zoomOut();
  }, [isMapLoaded, mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapLoaded || !map) {
      return;
    }

    const updateZoomState = () => {
      const zoom = map.getZoom();
      setCanZoomIn(zoom < map.getMaxZoom());
      setCanZoomOut(zoom > map.getMinZoom());
    };

    updateZoomState();
    map.on('zoom', updateZoomState);

    return () => {
      map.off('zoom', updateZoomState);
    };
  }, [isMapLoaded, mapRef]);

  // Was not working as expected, so disabled for now
  /* useHotkey('Mod+=', zoomIn, {
    enabled: canZoomIn,
    preventDefault: true,
  });

  useHotkey('Mod+-', zoomOut, {
    enabled: canZoomOut,
    preventDefault: true,
  }); */

  return { zoomIn, zoomOut, canZoomIn, canZoomOut };
};
