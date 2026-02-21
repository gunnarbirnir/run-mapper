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

    const map = mapRef.current;

    const addRoute = () => {
      if (map.getSource('route-source')) {
        return;
      }
      map.addSource('route-source', {
        type: 'geojson',
        data: getLineFeature(coordinates),
      });
      map.addLayer(getRouteLayer());
    };

    addRoute();
    map.on('style.load', addRoute);

    return () => {
      map.off('style.load', addRoute);
    };
  }, [isMapLoaded, coordinates, mapRef]);
};
