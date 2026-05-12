import type { GeoJSONSource, Map } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  useRef,
  type MutableRefObject,
  useMemo,
} from 'react';

import type { Coordinates, Elevation } from '~/types';
import { getLineFeature, getRouteLayer } from '~/utils/map';

import { getRouteAnimationDuration } from '../utils';

interface UseMapRouteProps {
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
  coordinates: Coordinates[];
  elevations: Elevation[];
  routeIsAnimating: boolean;
  animateRouteRef: MutableRefObject<(() => void) | null>;
  setRouteIsAnimating: (routeIsAnimating: boolean) => void;
}

const ELEVATION_SPEED_FACTOR = 0.15;
const MIN_SEGMENT_COST = 0.2;

/**
 * Builds a normalized [0,1] cumulative timeline where uphill segments
 * occupy a larger portion of the timeline (slower animation) and
 * downhill segments occupy a smaller portion (faster animation).
 */
const buildElevationTimeline = (elevations: Elevation[]): number[] => {
  const n = elevations.length;
  if (n < 2) return [0];

  const cumulativeTime = new Array<number>(n);
  cumulativeTime[0] = 0;

  for (let i = 1; i < n; i++) {
    const elevDiff = elevations[i].value - elevations[i - 1].value;
    const cost = Math.max(
      MIN_SEGMENT_COST,
      1 + ELEVATION_SPEED_FACTOR * elevDiff,
    );
    cumulativeTime[i] = cumulativeTime[i - 1] + cost;
  }

  const total = cumulativeTime[n - 1];
  for (let i = 0; i < n; i++) {
    cumulativeTime[i] /= total;
  }

  return cumulativeTime;
};

const findTimelineIndex = (timeline: number[], target: number): number => {
  let lo = 0;
  let hi = timeline.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (timeline[mid] <= target) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
};

export const useMapRoute = ({
  isMapLoaded,
  coordinates,
  elevations,
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
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    let animationFrame: number | null = null;
    let onStyleLoad: () => void = () => {};
    isInitialLoadRef.current = true;
    const routeLayer = getRouteLayer();

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

      map.addSource('route-source', {
        type: 'geojson',
        data: getLineFeature(coordinates.slice(0, 1)),
      });
      map.addLayer(getRouteLayer());

      const source = map.getSource('route-source') as GeoJSONSource;
      const timeline = buildElevationTimeline(elevations);
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const progress = Math.min(
          (timestamp - startTime) / animationDuration,
          1,
        );
        const index = Math.max(2, findTimelineIndex(timeline, progress));

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
  }, [
    isMapLoaded,
    coordinates,
    elevations,
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
