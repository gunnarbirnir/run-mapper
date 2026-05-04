import mapboxgl, { type Popup } from 'mapbox-gl';

import type {
  BoundingBox,
  Coordinates,
  WaypointType,
  InnerWaypointType,
  Bounds,
  Waypoint,
  PointOfInterest,
  PointOfInterestType,
} from '~/types';
import { getCssVariableValue, cn, formatNumber } from '~/utils';
import {
  getWaypointPoiIconSize,
  getWaypointPoiIcon,
  getWaypointPoiLabel,
  getPoiIconColor,
} from '~/utils/route';

import {
  BOUNDS_PADDING,
  BOUNDS_PADDING_TOP,
  LINE_OPACITY,
  LINE_WIDTH,
} from './constants';
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
  marker.className = `w-3 h-3 rounded-full bg-gray-900`;

  return marker;
};

export const getWaypointMarkerElement = (
  type: WaypointType,
  onClick: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center cursor-pointer bg-secondary-500 text-white hover:brightness-110`;
  marker.innerHTML = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);
  marker.querySelector('svg')?.classList.add(iconSize.width, iconSize.height);
  marker.addEventListener('click', onClick);

  return marker;
};

export const getPointOfInterestMarkerElement = (
  type: PointOfInterestType,
  onClick: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = `w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center cursor-pointer text-white hover:brightness-110`;
  marker.style.backgroundColor = getCssVariableValue(getPoiIconColor(type));
  marker.innerHTML = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);
  marker.querySelector('svg')?.classList.add(iconSize.width, iconSize.height);
  marker.addEventListener('click', onClick);

  return marker;
};

export const getWaypointTooltip = (waypoint: Waypoint): Popup => {
  const waypointAmenities: InnerWaypointType[] =
    waypoint.amenities && waypoint.amenities.length > 0
      ? [waypoint.type as InnerWaypointType, ...waypoint.amenities].filter(
          (amenity, index, self) => {
            return self.findIndex((a) => a === amenity) === index;
          },
        )
      : [];

  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 16,
    className: 'waypoint-poi-popup',
  }).setHTML(
    `<div class="flex flex-col gap-1 max-w-60 max-h-60 overflow-y-auto p-3 pt-2">
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
        <h4 class="font-medium text-sm text-gray-700">${formatNumber(waypoint.position)} km</h4>
      </div>
      ${waypoint.description ? `<p class="text-sm text-gray-500 mt-1">${waypoint.description}</p>` : ''}
      ${
        waypointAmenities.length > 0
          ? `<div class="flex flex-wrap gap-2 mt-3">${waypointAmenities
              .map(
                (amenity) =>
                  `<div class="bg-secondary-500 flex h-6 w-6 items-center justify-center rounded-md shadow-sm">
                    <div class="scale-[1.1] text-white ${getWaypointPoiIconSize(amenity).size}">
                      ${getWaypointPoiIcon(amenity)}
                    </div>
                  </div>`,
              )
              .join('')}
            </div>`
          : ''
      }
      ${
        waypointAmenities.length > 0
          ? `<p class="text-tiny text-gray-400">
              ${waypointAmenities.map((amenity) => getWaypointPoiLabel(amenity)).join(', ')}
            </p>`
          : ''
      }
    </div>`,
  );
};

// Tab index of buttons comes after elevation graph
export const getPointOfInterestTooltip = (
  pointOfInterest: PointOfInterest,
  onClose: () => void,
): Popup => {
  const tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 16,
    className: 'waypoint-poi-popup',
  }).setHTML(
    `<div class="flex flex-col gap-1 max-w-60 max-h-60 overflow-y-auto p-3">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-base font-medium text-gray-900">${pointOfInterest.name}</h2>
        <button class="bg-gray-200 text-gray-800 hover:bg-gray-300 size-6 rounded-full flex items-center justify-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="size-4" tab-index="50">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2.125" d="M5 19 19 5M19 19 5 5"/>
          </svg>
        </button>
      </div>
      ${pointOfInterest.description ? `<p class="text-sm text-gray-500 mt-1">${pointOfInterest.description}</p>` : ''}
    </div>`,
  );

  const button = tooltip._content?.querySelector('button');
  if (button) {
    button.addEventListener('click', onClose);
  }

  return tooltip;
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

const TOOLTIP_BASE_LAT_OFFSET = 0.001;
const TOOLTIP_OFFSET_MULTIPLIER_MIN = 1;
const TOOLTIP_OFFSET_MULTIPLIER_MAX = 3;
const TOOLTIP_AMENITIES_WEIGHT = 50;

export const getTooltipLatOffset = ({
  description,
  amenities,
}: {
  description?: string;
  amenities?: unknown[];
}): number => {
  const contentLength =
    (description?.length ?? 0) +
    (amenities?.length ? TOOLTIP_AMENITIES_WEIGHT : 0);

  const multiplier = Math.min(
    TOOLTIP_OFFSET_MULTIPLIER_MAX,
    Math.max(TOOLTIP_OFFSET_MULTIPLIER_MIN, Math.ceil(contentLength / 100)),
  );

  return multiplier * TOOLTIP_BASE_LAT_OFFSET;
};
