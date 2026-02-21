import type { GeoJSONSource, Map } from 'mapbox-gl';
import { RefObject, useEffect, useRef, type MutableRefObject } from 'react';

import type { Coordinates } from '~/types';

import { ROUTE_ANIMATION_DURATION } from '../constants';
import { getLineFeature, getRouteLayer } from '../utils';

interface UseRouteProps {
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
  coordinates: Coordinates[];
  animateRouteRef: MutableRefObject<(() => void) | null>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useRoute = ({
  isMapLoaded,
  coordinates,
  mapRef,
  animateRouteRef,
}: UseRouteProps) => {
  const isInitialLoadRef = useRef(true);
  const isVisibleRef = useRef(document.visibilityState === 'visible');

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    let animationFrame: number | null = null;
    let onStyleLoad: () => void = () => {};

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

    const animateRoute = () => {
      if (map.getSource('route-source')) {
        map.removeLayer('route-layer');
        map.removeSource('route-source');
      }

      map.addSource('route-source', {
        type: 'geojson',
        data: getLineFeature(coordinates.slice(0, 1)),
      });
      map.addLayer(getRouteLayer());

      const source = map.getSource('route-source') as GeoJSONSource;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const progress = Math.min(
          (timestamp - startTime) / ROUTE_ANIMATION_DURATION,
          1,
        );
        const index = Math.max(
          2,
          Math.floor(easeOutCubic(progress) * coordinates.length),
        );

        source.setData(getLineFeature(coordinates.slice(0, index)));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          source.setData(getLineFeature(coordinates));
          animationFrame = null;
        }
      };

      animationFrame = requestAnimationFrame(step);
    };

    onStyleLoad = () => {
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        if (isVisibleRef.current) {
          animateRoute();
        }
      } else {
        addRoute();
      }
    };
    map.on('style.load', onStyleLoad);
    animateRouteRef.current = animateRoute;

    const handleMapVisibility = () => {
      if (
        !isVisibleRef.current &&
        document.visibilityState === 'visible' &&
        map.isStyleLoaded()
      ) {
        isVisibleRef.current = true;
        animateRoute();
      }
    };
    document.addEventListener('visibilitychange', handleMapVisibility);

    return () => {
      animateRouteRef.current = null;
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      map.off('style.load', onStyleLoad);
      document.removeEventListener('visibilitychange', handleMapVisibility);
    };
  }, [isMapLoaded, coordinates, mapRef, animateRouteRef]);
};
