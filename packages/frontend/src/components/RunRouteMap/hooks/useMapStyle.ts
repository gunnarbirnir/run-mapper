import { useEffect, type MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import type { MapStyle } from '~/types';

import { MAP_STYLES } from '../constants';

interface UseMapStyleProps {
  isMapLoaded: boolean;
  mapRef: MutableRefObject<Map | null>;
  mapStyle: MapStyle;
}

export const useMapStyle = ({
  isMapLoaded,
  mapRef,
  mapStyle,
}: UseMapStyleProps) => {
  // Handle map style change
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }
    mapRef.current.setStyle(MAP_STYLES[mapStyle]);
  }, [isMapLoaded, mapStyle, mapRef]);
};
