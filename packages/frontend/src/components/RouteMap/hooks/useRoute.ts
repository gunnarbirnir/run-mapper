import { RefObject, useEffect } from 'react';
import type { Map } from 'mapbox-gl';

import type { Coordinates } from '~/types';

import { getLineFeature, getRouteLayer } from '../utils';

interface UseRouteProps {
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
  coordinates: Coordinates[];
}

export const useRoute = ({
  isMapLoaded,
  coordinates,
  mapRef,
}: UseRouteProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    mapRef.current.addSource('route-source', {
      type: 'geojson',
      data: getLineFeature(coordinates),
    });
    mapRef.current.addLayer(getRouteLayer());
  }, [isMapLoaded, coordinates, mapRef]);
};
