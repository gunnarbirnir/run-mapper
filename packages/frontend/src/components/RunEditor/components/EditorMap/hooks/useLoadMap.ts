import { RefObject, useEffect, MutableRefObject } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

import { MAP_STYLES } from '~/constants/map';

import { DEFAULT_EDITOR_BOUNDS } from '../constants';

interface UseLoadMapProps {
  setIsMapLoaded: (isMapLoaded: boolean) => void;
  mapRef: MutableRefObject<Map | null>;
  mapContainerRef: RefObject<HTMLDivElement>;
}

export const useLoadMap = ({
  setIsMapLoaded,
  mapRef,
  mapContainerRef,
}: UseLoadMapProps) => {
  useEffect(() => {
    setIsMapLoaded(false);
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: DEFAULT_EDITOR_BOUNDS,
      style: MAP_STYLES.standard,
      attributionControl: false,
      logoPosition: 'bottom-right',
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
  }, [mapContainerRef, mapRef, setIsMapLoaded]);
};
