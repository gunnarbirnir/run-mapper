import type { Map } from 'mapbox-gl';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';

import { Coordinates } from '~/types';
import { useMapHandlers } from '~/hooks/useMapHandlers';

import { getActiveMarkerElement } from '../utils';

interface UseActiveMarkerProps {
  isMapLoaded: boolean;
  coordinates: Coordinates[];
  hideActiveMarker: boolean;
  mapRef: RefObject<Map>;
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
}

export const useActiveMarker = ({
  isMapLoaded,
  coordinates,
  hideActiveMarker,
  mapRef,
  setActiveIndexRef,
}: UseActiveMarkerProps) => {
  const hideActiveMarkerRef = useRef(hideActiveMarker);
  const { addMarker } = useMapHandlers({ mapRef });

  // Sync ref to state
  useEffect(() => {
    hideActiveMarkerRef.current = hideActiveMarker;
  }, [hideActiveMarker]);

  // Draw active marker
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const activeMarkerElement = getActiveMarkerElement();
    const activeMarker = addMarker(activeMarkerElement, coordinates[0]);
    activeMarkerElement.style.display = 'none';

    setActiveIndexRef.current = (updatedIndex: number | null) => {
      if (updatedIndex !== null && !hideActiveMarkerRef.current) {
        activeMarkerElement.style.display = 'block';
        activeMarker?.setLngLat([
          coordinates[updatedIndex].lng,
          coordinates[updatedIndex].lat,
        ]);
      } else {
        activeMarkerElement.style.display = 'none';
      }
    };

    return () => {
      activeMarker?.remove();
      setActiveIndexRef.current = null;
    };
  }, [
    isMapLoaded,
    coordinates,
    addMarker,
    mapRef,
    setActiveIndexRef,
    hideActiveMarkerRef,
  ]);
};
