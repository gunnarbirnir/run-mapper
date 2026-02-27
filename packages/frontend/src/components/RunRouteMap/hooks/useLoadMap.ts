import { RefObject, useEffect, MutableRefObject } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

import type { Bounds, MapStyle } from '~/types';

import { MAP_STYLES } from '../constants';

interface UseLoadMapProps {
  paddedBounds: Bounds;
  mapStyle: MapStyle;
  setIsMapLoaded: (isMapLoaded: boolean) => void;
  mapRef: MutableRefObject<Map | null>;
  mapContainerRef: RefObject<HTMLDivElement>;
}

export const useLoadMap = ({
  paddedBounds,
  mapStyle,
  setIsMapLoaded,
  mapRef,
  mapContainerRef,
}: UseLoadMapProps) => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: paddedBounds,
      style: MAP_STYLES[mapStyle],
      attributionControl: false,
    });
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
    });
    mapRef.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
    );

    return () => {
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddedBounds]);
};
