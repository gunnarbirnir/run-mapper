import type { BoundingBox, Bounds, Coordinates } from '~/types';
import { getCssVariableValue } from '~/utils';

import {
  BOUNDS_PADDING,
  BOUNDS_PADDING_TOP,
  LINE_OPACITY,
  LINE_WIDTH,
} from '~/constants/map';
import type { LineFeature } from '~/types';

export const getPaddedBounds = (boundingBox: BoundingBox): Bounds => {
  const { lng: minLng, lat: minLat } = boundingBox[0];
  const { lng: maxLng, lat: maxLat } = boundingBox[1];
  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;
  const lngPadding = lngRange * BOUNDS_PADDING;
  const latPadding = latRange * BOUNDS_PADDING;
  const latPaddingTop = latRange * BOUNDS_PADDING_TOP;

  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPaddingTop],
  ];
};

export const getLineFeature = (coordinates: Coordinates[]): LineFeature => {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates.map((coordinate) => [
        coordinate.lng,
        coordinate.lat,
      ]),
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
