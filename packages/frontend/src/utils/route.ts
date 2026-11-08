import { MAP_ICONS } from '~/constants/mapIcons';
import type {
  Coordinates,
  InnerWaypointType,
  PointOfInterestType,
  RouteCoordinates,
  WaypointType,
  BoundingBox,
  Waypoint,
} from '~/types';

export const getBoundingBox = (coordinates: Coordinates[]): BoundingBox => {
  const minLat = Math.min(...coordinates.map((c) => c.lat));
  const maxLat = Math.max(...coordinates.map((c) => c.lat));
  const minLng = Math.min(...coordinates.map((c) => c.lng));
  const maxLng = Math.max(...coordinates.map((c) => c.lng));

  return [
    { lat: minLat, lng: minLng },
    { lat: maxLat, lng: maxLng },
  ];
};

export const getCoordinatesFromPosition = (
  position: number,
  coordinates: RouteCoordinates[],
): RouteCoordinates | null => {
  if (coordinates.length === 0) {
    return null;
  }

  let closestCoordinate = coordinates[0];
  let closestDelta = position;

  for (let i = 1; i < coordinates.length; i++) {
    const currentCoordinate = coordinates[i];
    const delta = Math.abs(position - (currentCoordinate.distance ?? 0));

    if (delta < closestDelta) {
      closestDelta = delta;
      closestCoordinate = currentCoordinate;
    }
  }

  return closestCoordinate;
};

export const getWaypointPoiIcon = (icon: string): string => {
  return MAP_ICONS[icon as InnerWaypointType | PointOfInterestType] ?? '';
};

export const getWaypointPoiIconSize = (
  type: WaypointType | PointOfInterestType,
): { height: string; width: string; size: string } => {
  switch (type) {
    case 'energy':
    case 'entertainment':
      return { height: 'h-4', width: 'w-4', size: 'size-4' };
    case 'award-ceremony':
      return { height: 'h-3', width: 'w-3', size: 'size-3' };
    default:
      return { height: 'h-3.5', width: 'w-3.5', size: 'size-3.5' };
  }
};

export const getPoiIconColor = (type: PointOfInterestType): string => {
  switch (type) {
    case 'expo':
      return '--color-util-dark-gray';
    case 'food-and-drinks':
      return '--color-util-green';
    case 'entertainment':
      return '--color-util-purple';
    case 'aid-station':
      return '--color-util-red';
    case 'parking':
      return '--color-util-dark-blue';
    case 'restrooms':
      return '--color-util-light-gray';
    case 'information':
      return '--color-util-light-blue';
    case 'bag-drop-off':
      return '--color-util-brown';
    case 'showers-and-changing-rooms':
      return '--color-util-cyan';
    case 'award-ceremony':
      return '--color-util-yellow';
    case 'warm-up-area':
      return '--color-util-orange';
    case 'spectator-area':
      return '--color-util-pink';
    default:
      return '--color-util-dark-blue';
  }
};

export const getWaypointPoiLabel = (
  type: WaypointType | PointOfInterestType,
): string => {
  switch (type) {
    case 'energy':
      return 'Energy';
    case 'hydration':
      return 'Hydration';
    case 'entertainment':
      return 'Entertainment';
    case 'timing':
      return 'Timing';
    case 'restrooms':
      return 'Restrooms';
    case 'start':
      return 'Start';
    case 'end':
      return 'End';
    case 'expo':
      return 'Expo';
    case 'bag-drop-off':
      return 'Bag drop off';
    case 'warm-up-area':
      return 'Warm up area';
    case 'food-and-drinks':
      return 'Food and drinks';
    case 'spectator-area':
      return 'Spectator area';
    case 'aid-station':
      return 'Aid station';
    case 'showers-and-changing-rooms':
      return 'Showers and changing rooms';
    case 'award-ceremony':
      return 'Award ceremony';
    case 'information':
      return 'Information';
    case 'parking':
      return 'Parking';
    default:
      return type;
  }
};

export const isInnerWaypoint = (waypoint: Waypoint): boolean => {
  return waypoint.type !== 'start' && waypoint.type !== 'end';
};

export const isSameRoute = (
  coordinates1: Coordinates[],
  coordinates2: Coordinates[],
): boolean => {
  if (coordinates1.length !== coordinates2.length) {
    return false;
  }

  for (let i = 0; i < coordinates1.length; i++) {
    if (
      coordinates1[i].lat !== coordinates2[i].lat ||
      coordinates1[i].lng !== coordinates2[i].lng
    ) {
      return false;
    }
  }

  return true;
};
