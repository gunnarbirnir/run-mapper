import { RefObject, useEffect, MutableRefObject } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

import { MAP_STYLES, BOUNDS_PADDING, BOUNDS_MAX_ZOOM } from '~/constants/map';
import type { Bounds } from '~/types';

interface UseLoadMapProps {
  initialBounds: Bounds;
  setIsMapLoaded: (isMapLoaded: boolean) => void;
  mapRef: MutableRefObject<Map | null>;
  mapContainerRef: RefObject<HTMLDivElement>;
}

export const useLoadMap = ({
  initialBounds,
  setIsMapLoaded,
  mapRef,
  mapContainerRef,
}: UseLoadMapProps) => {
  useEffect(() => {
    setIsMapLoaded(false);
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: initialBounds,
      fitBoundsOptions: { padding: BOUNDS_PADDING, maxZoom: BOUNDS_MAX_ZOOM },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
