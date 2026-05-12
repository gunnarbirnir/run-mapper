import { RefObject, useEffect, MutableRefObject } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

import type { Bounds, MapStyle } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import {
  MAP_STYLES,
  FIT_INITIAL_BOUNDS_DURATION,
  BOUNDS_PADDING,
} from '~/constants/map';

interface UseLoadMapProps {
  bounds: Bounds;
  mapStyle: MapStyle;
  setIsMapLoaded: (isMapLoaded: boolean) => void;
  mapRef: MutableRefObject<Map | null>;
  mapContainerRef: RefObject<HTMLDivElement>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useLoadMap = ({
  bounds,
  mapStyle,
  setIsMapLoaded,
  mapRef,
  mapContainerRef,
  isResettingBoundsRef,
}: UseLoadMapProps) => {
  const { isSmallScreen } = useMediaQuery();

  useEffect(() => {
    setIsMapLoaded(false);
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: bounds,
      // Commented out for small animation effect
      /* fitBoundsOptions: {
        padding: BOUNDS_PADDING,
      }, */
      style: MAP_STYLES[mapStyle],
      attributionControl: false,
      logoPosition: isSmallScreen ? 'left' : 'bottom',
    });
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
      mapRef.current?.fitBounds(bounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
        padding: BOUNDS_PADDING,
      });
      isResettingBoundsRef.current = true;
    });
    mapRef.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
    );

    return () => {
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);
};
