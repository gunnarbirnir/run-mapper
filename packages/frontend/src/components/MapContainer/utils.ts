import { getCssVariableValue } from '~/utils';

import type { LineFeature, RouteFeature } from './types';
import { BOUNDS_PADDING, LINE_WIDTH, LINE_OPACITY } from './constants';

export const getPaddedBounds = (
  bounds: [number, number, number, number],
): [[number, number], [number, number]] => {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;
  const lngPadding = lngRange * BOUNDS_PADDING;
  const latPadding = latRange * BOUNDS_PADDING;

  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPadding],
  ];
};

export const getLineFeature = (routeFeatures: RouteFeature[]): LineFeature => {
  const coordinates = routeFeatures
    .map((feature) => {
      if (feature.geometry.type === 'Point') {
        return feature.geometry.coordinates;
      }
      return null;
    })
    .filter((coord): coord is [number, number] => coord !== null);

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
