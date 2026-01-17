import { getCssVariableValue } from '~/utils';
import type { Bounds, Coordinates, WayPointType } from '~/types';

import type { LineFeature } from './types';
import { BOUNDS_PADDING, LINE_WIDTH, LINE_OPACITY } from './constants';
import { ENERGY_ICON, ENTERTAINMENT_ICON } from './icons';

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

export const getMarkerElement = (color: string): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6 h-6 rounded-full border-4 border-white shadow-md/30`;
  marker.style.backgroundColor = getCssVariableValue(color);

  return marker;
};

export const getActiveMarkerElement = (): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-3 h-3 rounded-full`;
  marker.style.backgroundColor = getCssVariableValue('--color-black');

  return marker;
};

const getIcon = (type: WayPointType) => {
  switch (type) {
    case 'energy':
      return ENERGY_ICON;
    case 'entertainment':
      return ENTERTAINMENT_ICON;
  }
};

export const getWaypointMarkerElement = (type: WayPointType): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6 h-6 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center`;
  marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  marker.innerHTML = getIcon(type);

  return marker;
};
