import { getCssVariableValue } from '~/utils';
import type { Bounds, Coordinates } from '~/types';

import type { LineFeature } from './types';
import { BOUNDS_PADDING, LINE_WIDTH, LINE_OPACITY } from './constants';

export const getPaddedBounds = (bounds: Bounds): Bounds => {
  const [minLng, minLat] = bounds[0];
  const [maxLng, maxLat] = bounds[1];
  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;
  const lngPadding = lngRange * BOUNDS_PADDING;
  const latPadding = latRange * BOUNDS_PADDING;

  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPadding],
  ];
};

export const getLineFeature = (coordinates: Coordinates[]): LineFeature => {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {},
  };
};

export const getRouteLayer = () => {
  return {
    id: 'route-layer',
    type: 'line',
    source: 'route-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': getCssVariableValue('--color-primary-500'),
      'line-width': LINE_WIDTH,
      'line-opacity': LINE_OPACITY,
    },
  } as const;
};

export const getMarkerElement = (
  color: string,
  size: 'small' | 'medium' | 'large' = 'large',
): HTMLElement => {
  const marker = document.createElement('div');
  if (size === 'small') {
    marker.className = `w-3 h-3 rounded-full`;
  } else if (size === 'medium') {
    marker.className = `w-5 h-5 rounded-full border-3 border-white shadow-md/30`;
  } else {
    marker.className = `w-6 h-6 rounded-full border-4 border-white shadow-md/30`;
  }
  marker.style.backgroundColor = getCssVariableValue(color);

  return marker;
};
