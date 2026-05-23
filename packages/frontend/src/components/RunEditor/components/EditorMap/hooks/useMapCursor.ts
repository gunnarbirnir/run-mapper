import { Map } from 'mapbox-gl';
import { MutableRefObject, useEffect } from 'react';

interface UseMapCursorProps {
  isMapLoaded: boolean;
  isEditingPoiCoordinates: string | null;
  mapRef: MutableRefObject<Map | null>;
}

export const useMapCursor = ({
  isMapLoaded,
  isEditingPoiCoordinates,
  mapRef,
}: UseMapCursorProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const canvas = mapRef.current.getCanvas();
    canvas.style.cursor = isEditingPoiCoordinates ? 'crosshair' : '';

    return () => {
      canvas.style.cursor = '';
    };
  }, [isMapLoaded, isEditingPoiCoordinates, mapRef]);
};
