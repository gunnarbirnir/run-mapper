import { getCssVariableValue } from '~/utils';
import type { Bounds, Coordinates, WayPointType } from '~/types';

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

export const getWaypointMarkerElement = (type: WayPointType): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6 h-6 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center`;
  marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  const iconColor = getCssVariableValue('--color-white');

  const getIconPath = () => {
    switch (type) {
      case 'energy':
        return 'M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z';
      case 'entertainment':
        return 'M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z';
    }
  };

  marker.innerHTML = `<svg viewBox="0 0 24 24" fill="${iconColor}" class="size-4">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${getIconPath()}" />
  </svg>`;

  return marker;
};
