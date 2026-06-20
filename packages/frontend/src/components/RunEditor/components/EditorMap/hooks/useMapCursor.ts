import { Map } from 'mapbox-gl';
import { MutableRefObject, useEffect } from 'react';

interface UseMapCursorProps {
  isMapLoaded: boolean;
  isEditingRouteCoordinates: string | null;
  isEditingPoiCoordinates: string | null;
  mapRef: MutableRefObject<Map | null>;
}

export const useMapCursor = ({
  isMapLoaded,
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  mapRef,
}: UseMapCursorProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const canvas = mapRef.current.getCanvas();
    canvas.style.cursor =
      isEditingRouteCoordinates || isEditingPoiCoordinates ? 'crosshair' : '';

    return () => {
      canvas.style.cursor = '';
    };
  }, [isMapLoaded, isEditingRouteCoordinates, isEditingPoiCoordinates, mapRef]);
};
