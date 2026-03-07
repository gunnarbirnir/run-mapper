import { MutableRefObject, useCallback } from 'react';
import mapboxgl, { type Map } from 'mapbox-gl';

import { Coordinates } from '~/types';

interface UseHandlersProps {
  mapRef: MutableRefObject<Map | null>;
}

export const useHandlers = ({ mapRef }: UseHandlersProps) => {
  const addMarker = useCallback(
    (element: HTMLElement, markerCoords: Coordinates) => {
      if (mapRef.current) {
        return new mapboxgl.Marker({ element })
          .setLngLat([markerCoords.lng, markerCoords.lat])
          .addTo(mapRef.current);
      }
    },
    [mapRef],
  );

  return { addMarker };
};
