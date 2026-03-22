import mapboxgl, { type Popup } from 'mapbox-gl';

import type {
  BoundingBox,
  Coordinates,
  WayPointType,
  InnerWayPointType,
  Bounds,
  Waypoint,
} from '~/types';
import { getCssVariableValue, cn, formatNumber } from '~/utils';
import { getWaypointIconSize } from '~/utils/route';

import {
  BOUNDS_PADDING,
  BOUNDS_PADDING_TOP,
  LINE_OPACITY,
  LINE_WIDTH,
} from './constants';
import { ICONS } from './icons';
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

export const getWaypointMarkerElement = (
  type: WayPointType,
  onClick: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center cursor-pointer`;
  marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  marker.style.color = 'white';
  marker.innerHTML = ICONS[type as InnerWayPointType];
  const iconSize = getWaypointIconSize(type);
  marker.querySelector('svg')?.classList.add(iconSize.width, iconSize.height);

  marker.addEventListener('click', onClick);
  marker.addEventListener('mouseenter', () => {
    marker.style.backgroundColor = getCssVariableValue('--color-secondary-600');
  });
  marker.addEventListener('mouseleave', () => {
    marker.style.backgroundColor = getCssVariableValue('--color-secondary-500');
  });

  return marker;
};

export const getWaypointTooltip = (waypoint: Waypoint): Popup => {
  const waypointAmenities: InnerWayPointType[] =
    waypoint.amenities && waypoint.amenities.length > 0
      ? [waypoint.type as InnerWayPointType, ...waypoint.amenities].filter(
          (amenity, index, self) => {
            return self.findIndex((a) => a === amenity) === index;
          },
        )
      : [];

  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -16],
    className: 'waypoint-popup',
  }).setHTML(
    `<div class="flex flex-col gap-1 max-w-60 min-w-40 max-h-60 overflow-y-auto p-3 pt-2">
      <h2 class="text-base font-medium text-gray-900">${waypoint.name}</h2>
      <div class="flex items-center gap-1">
        <div class="size-4 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M2.75 9.594C2.75 4.476 6.77.5 12 .5s9.25 3.976 9.25 9.094c0 2.747-1.477 5.472-3.134 7.685-1.672 2.234-3.617 4.063-4.727 5.035a2.096 2.096 0 0 1-2.778 0c-1.11-.972-3.055-2.8-4.727-5.035C4.227 15.066 2.75 12.34 2.75 9.594ZM12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h4 class="font-medium text-sm text-gray-700">${formatNumber(waypoint.distance)} km</h4>
      </div>
      ${waypoint.description ? `<p class="text-sm text-gray-500 mt-1">${waypoint.description}</p>` : ''}
      ${
        waypointAmenities.length > 0
          ? `<div class="flex flex-wrap gap-2 mt-3">${waypointAmenities
              .map(
                (amenity) =>
                  `<div class="bg-secondary-500 flex h-6 w-6 items-center justify-center rounded-md shadow-sm">
                  <div
                    class="scale-[1.1] text-white ${getWaypointIconSize(amenity).size}"
                  >
                    ${ICONS[amenity]}
                  </div>
                </div>`,
              )
              .join('')}
            </div>`
          : ''
      }
    </div>`,
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

const WAYPOINT_BASE_LAT_OFFSET = 0.001;
const WAYPOINT_OFFSET_MULTIPLIER_MIN = 1;
const WAYPOINT_OFFSET_MULTIPLIER_MAX = 3;

export const getWaypointLatOffset = (waypoint: Waypoint): number => {
  const multiplier = Math.min(
    WAYPOINT_OFFSET_MULTIPLIER_MAX,
    Math.max(
      WAYPOINT_OFFSET_MULTIPLIER_MIN,
      Math.floor((waypoint.description?.length ?? 0) / 100),
    ),
  );

  return multiplier * WAYPOINT_BASE_LAT_OFFSET;
};
