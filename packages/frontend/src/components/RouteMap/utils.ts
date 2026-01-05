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
      'line-color': getCssVariableValue('--color-secondary-700'),
      'line-width': LINE_WIDTH,
      'line-opacity': LINE_OPACITY,
    },
  } as const;
};
