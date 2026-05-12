import type {
  BoundingBox,
  Bounds,
  Coordinates,
  PointOfInterestType,
} from '~/types';
import {
  getPoiIconColor,
  getWaypointPoiIcon,
  getWaypointPoiIconSize,
} from '~/utils/route';
import { getCssVariableValue, cn } from '~/utils';
import { LINE_OPACITY, LINE_WIDTH } from '~/constants/map';
import type { LineFeature } from '~/types';

export const formatBounds = (boundingBox: BoundingBox): Bounds => {
  const { lng: minLng, lat: minLat } = boundingBox[0];
  const { lng: maxLng, lat: maxLat } = boundingBox[1];

  return [
    [minLng, minLat],
    [maxLng, maxLat],
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

export const getPointOfInterestMarkerElement = (
  type: PointOfInterestType,
  onClick?: () => void,
): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = cn(
    `w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center text-white hover:brightness-110`,
    { 'cursor-pointer': onClick },
  );
  marker.style.backgroundColor = getCssVariableValue(getPoiIconColor(type));
  marker.innerHTML = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);
  marker.querySelector('svg')?.classList.add(iconSize.width, iconSize.height);
  if (onClick) {
    marker.addEventListener('click', onClick);
  }

  return marker;
};
