import mapboxgl, { type Popup } from 'mapbox-gl';

import type {
  BoundingBox,
  Coordinates,
  WayPointType,
  Bounds,
  Waypoint,
} from '~/types';
import { getCssVariableValue, cn, formatNumber } from '~/utils';

import {
  BOUNDS_PADDING,
  BOUNDS_PADDING_TOP,
  LINE_OPACITY,
  LINE_WIDTH,
} from './constants';
import { ENERGY_ICON, ENTERTAINMENT_ICON } from './icons';
import type { LineFeature } from './types';

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

export const getMarkerElement = (
  color: string,
  hoverColor: string,
  onClick?: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = cn(
    'w-6 h-6 rounded-full border-4 border-white shadow-md/30',
    { 'cursor-pointer': onClick },
  );
  marker.style.backgroundColor = getCssVariableValue(color);

  if (onClick) {
    marker.addEventListener('click', onClick);
    marker.addEventListener('mouseenter', () => {
      marker.style.backgroundColor = getCssVariableValue(hoverColor);
    });
    marker.addEventListener('mouseleave', () => {
      marker.style.backgroundColor = getCssVariableValue(color);
    });
  }

  return marker;
};

export const getActiveMarkerElement = (): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-3 h-3 rounded-full`;
  marker.style.backgroundColor = getCssVariableValue('--color-gray-900');

  return marker;
};

const getIcon = (type: WayPointType): string => {
  switch (type) {
    case 'energy':
      return ENERGY_ICON;
    case 'entertainment':
      return ENTERTAINMENT_ICON;
    default:
      return '';
  }
};

export const getWaypointMarkerElement = (
  type: WayPointType,
  onClick: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6 h-6 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center cursor-pointer`;
  marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  marker.style.color = 'white';
  marker.innerHTML = getIcon(type);
  marker.querySelector('svg')?.classList.add('w-4', 'h-4');

  marker.addEventListener('click', onClick);
  marker.addEventListener('mouseenter', () => {
    marker.style.backgroundColor = getCssVariableValue('--color-secondary-600');
  });
  marker.addEventListener('mouseleave', () => {
    marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  });

  return marker;
};

export const getMarkerTooltip = (
  waypoint: Waypoint,
  isSmallScreen: boolean,
): Popup => {
  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -16],
    className: 'waypoint-popup',
  }).setHTML(
    isSmallScreen
      ? `<div class="flex flex-col gap-1 max-w-60"><h4 class="font-medium text-gray-900"><span class="bg-secondary-200 text-gray-700 px-1 inline-block rounded-sm mr-1">${formatNumber(waypoint.distance)} km</span>${waypoint.name}</h4><p class="text-sm text-gray-500">${waypoint.description}</p></div>`
      : `<h4 class="font-medium text-gray-900 max-w-40">${waypoint.name}</h4>`,
  );
};

const ROUTE_ANIMATION_DURATION_FACTOR = 0.6;
const MIN_ROUTE_ANIMATION_DURATION = 1000;
const MAX_ROUTE_ANIMATION_DURATION = 3000;

export const getRouteAnimationDuration = (
  coordinates: Coordinates[],
): number => {
  return Math.round(
    Math.max(
      Math.min(
        coordinates.length * ROUTE_ANIMATION_DURATION_FACTOR,
        MAX_ROUTE_ANIMATION_DURATION,
      ),
      MIN_ROUTE_ANIMATION_DURATION,
    ),
  );
};
