import type {
  BoundingBox,
  Bounds,
  Coordinates,
  PointOfInterestType,
  WaypointType,
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

export const getMarkerElement = ({
  color,
  hoverColor,
  onClick,
  isEditingInMap,
}: {
  color: string;
  hoverColor: string;
  onClick?: () => void;
  isEditingInMap?: boolean;
}): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = cn(
    'w-6 h-6 rounded-full border-4 border-white shadow-md/30',
    { 'cursor-pointer': onClick, 'cursor-crosshair': isEditingInMap },
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

export const getWaypointMarkerElement = ({
  type,
  onClick,
  isFocused,
  isEditingInMap,
}: {
  type: WaypointType;
  onClick?: () => void;
  isFocused?: boolean;
  isEditingInMap?: boolean;
}): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = cn(
    'w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center bg-secondary-500 text-white',
    {
      'cursor-pointer hover:brightness-110': onClick,
      'outline outline-2': isFocused,
      'cursor-crosshair': isEditingInMap,
    },
  );
  marker.innerHTML = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);
  marker.querySelector('svg')?.classList.add(iconSize.width, iconSize.height);
  if (onClick) {
    marker.addEventListener('click', onClick);
  }

  return marker;
};

export const getPointOfInterestMarkerElement = ({
  type,
  onClick,
  isFocused,
  isEditingInMap,
}: {
  type: PointOfInterestType;
  onClick?: () => void;
  isFocused?: boolean;
  isEditingInMap?: boolean;
}): HTMLElement => {
  const marker = document.createElement('div');

  marker.className = cn(
    `w-6.5 h-6.5 rounded-full border-3 border-white shadow-md/30 flex items-center justify-center text-white`,
    {
      'cursor-pointer hover:brightness-110': onClick,
      'outline outline-2': isFocused,
      'cursor-crosshair': isEditingInMap,
    },
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

export const getRoutePointElement = ({
  isSelected,
  onClick,
  onEnter,
  onLeave,
}: {
  isSelected?: boolean;
  onClick?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
}): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = cn(
    'w-3 h-3 rounded-full border-2 border-white cursor-crosshair bg-primary-500 shadow-md',
    {
      'cursor-pointer hover:h-4 hover:w-4': onClick && !isSelected,
      'h-5 w-5 outline outline-2': isSelected,
    },
  );

  if (onClick) {
    marker.addEventListener('click', onClick);
    if (onEnter) {
      marker.addEventListener('mouseenter', onEnter);
    }
    if (onLeave) {
      marker.addEventListener('mouseleave', onLeave);
    }
  }

  return marker;
};
