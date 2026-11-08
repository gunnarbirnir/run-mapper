import type { GeoJSONSource, Map } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  useRef,
  type MutableRefObject,
  useMemo,
} from 'react';

import type { RouteCoordinates } from '~/types';
import { getLineFeature, getRouteLayer } from '~/utils/map';

import { getRouteAnimationDuration } from '../utils';

interface UseMapRouteProps {
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
  coordinates: RouteCoordinates[];
  routeIsAnimating: boolean;
  animateRouteRef: MutableRefObject<(() => void) | null>;
  setRouteIsAnimating: (routeIsAnimating: boolean) => void;
}

export const useMapRoute = ({
  isMapLoaded,
  coordinates,
  routeIsAnimating,
  mapRef,
  animateRouteRef,
  setRouteIsAnimating,
}: UseMapRouteProps) => {
  const isInitialLoadRef = useRef(true);
  const isVisibleRef = useRef(document.visibilityState === 'visible');
  const animationDuration = useMemo(
    () => getRouteAnimationDuration(coordinates),
    [coordinates],
  );

  // Draw route
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !coordinates.length) {
      return;
    }

    const map = mapRef.current;
    let animationFrame: number | null = null;
    const routeLayer = getRouteLayer();

    const drawRoute = () => {
      const source = map.getSource(routeLayer.source);
      const routeLineFeature = getLineFeature(coordinates);

      if (source) {
        (source as mapboxgl.GeoJSONSource).setData(routeLineFeature);
      } else {
        map.addSource(routeLayer.source, {
          type: 'geojson',
          data: routeLineFeature,
        });
        map.addLayer(routeLayer);
      }
    };

    const clearRoute = () => {
      if (map.getLayer(routeLayer.id)) {
        map.removeLayer(routeLayer.id);
      }
      if (map.getSource(routeLayer.source)) {
        map.removeSource(routeLayer.source);
      }
    };

    const animateRoute = () => {
      setRouteIsAnimating(true);
      clearRoute();

      map.addSource(routeLayer.source, {
        type: 'geojson',
        data: getLineFeature(coordinates.slice(0, 1)),
      });
      map.addLayer(routeLayer);

      const source = map.getSource(routeLayer.source) as GeoJSONSource;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const progress = Math.min(
          (timestamp - startTime) / animationDuration,
          1,
        );
        const index = Math.max(2, Math.ceil(progress * coordinates.length));

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
    animateRouteRef.current = animateRoute;

    const onStyleLoad = () => {
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        if (isVisibleRef.current) {
          // The iframe is visible when the style loads for the first time
          animateRoute();
        }
      } else {
        // When switching styles
        drawRoute();
      }
    };
    map.on('style.load', onStyleLoad);

    const handleMapVisibility = () => {
      if (
        !isVisibleRef.current &&
        document.visibilityState === 'visible' &&
        map.isStyleLoaded()
      ) {
        isVisibleRef.current = true;
        // The iframe is scrolled into view
        animateRoute();
      }
    };
    document.addEventListener('visibilitychange', handleMapVisibility);

    return () => {
      isInitialLoadRef.current = true;
      animateRouteRef.current = null;
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      map.off('style.load', onStyleLoad);
      document.removeEventListener('visibilitychange', handleMapVisibility);
    };
  }, [
    isMapLoaded,
    coordinates,
    animationDuration,
    setRouteIsAnimating,
    mapRef,
    animateRouteRef,
  ]);

  // Reset animating state
  useEffect(() => {
    if (!routeIsAnimating) {
      return;
    }

    const animationTimeout = setTimeout(() => {
      setRouteIsAnimating(false);
    }, animationDuration);

    return () => {
      clearTimeout(animationTimeout);
      setRouteIsAnimating(false);
    };
  }, [routeIsAnimating, animationDuration, setRouteIsAnimating]);
};
