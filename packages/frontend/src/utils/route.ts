import { MAP_ICONS } from '~/constants/mapIcons';
import type {
  Coordinates,
  Elevation,
  InnerWaypointType,
  PointOfInterestType,
  RouteCoordinates,
  Waypoint,
  WaypointType,
} from '~/types';

export const processRunRoute = (
  routeCoordinates: RouteCoordinates[] = [],
): { coordinates: Coordinates[]; elevations: Elevation[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: Elevation[] = [];
  let distance = 0;
  let prevCoord: Coordinates | null = null;

  routeCoordinates.forEach((routeCoordinate) => {
    const currentCoord: Coordinates = {
      lng: routeCoordinate.lng,
      lat: routeCoordinate.lat,
    };
    if (prevCoord) {
      distance += haversineDistance(prevCoord, currentCoord);
    }
    coordinates.push(currentCoord);
    prevCoord = currentCoord;
    elevations.push({ value: routeCoordinate.elevation, distance });
  });

  return { coordinates, elevations };
};

export const haversineDistance = (
  coord1: Coordinates,
  coord2: Coordinates,
): number => {
  const { lng: lng1, lat: lat1 } = coord1;
  const { lng: lng2, lat: lat2 } = coord2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateDistance = (coordinates: Coordinates[]): number => {
  if (coordinates.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(coordinates[i], coordinates[i + 1]);
  }

  return totalDistance;
};

export const calculateElevationGain = (elevations: Elevation[]): number => {
  if (elevations.length < 2) {
    return 0;
  }

  let totalGain = 0;
  for (let i = 0; i < elevations.length - 1; i++) {
    const diff = elevations[i + 1].value - elevations[i].value;
    if (diff > 0) {
      totalGain += diff;
    }
  }

  return totalGain;
};

export const calculateElevationLoss = (elevations: Elevation[]): number => {
  if (elevations.length < 2) {
    return 0;
  }

  let totalLoss = 0;
  for (let i = 0; i < elevations.length - 1; i++) {
    const diff = elevations[i].value - elevations[i + 1].value;
    if (diff > 0) {
      totalLoss += diff;
    }
  }

  return totalLoss;
};

export const calculateMaxElevation = (
  elevations: Elevation[],
): { value: number; index: number } => {
  let maxValue = 0;
  let maxIndex = 0;

  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i].value > maxValue) {
      maxValue = elevations[i].value;
      maxIndex = i;
    }
  }

  return { value: maxValue, index: maxIndex };
};

export const calculateMinElevation = (
  elevations: Elevation[],
): { value: number; index: number } => {
  let minValue = Infinity;
  let minIndex = 0;

  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i].value < minValue) {
      minValue = elevations[i].value;
      minIndex = i;
    }
  }

  return { value: minValue, index: minIndex };
};

export const getCoordinatesFromPosition = (
  position: number,
  coordinates: Coordinates[],
): Coordinates | null => {
  if (coordinates.length === 0) {
    return null;
  }

  let cumulativeDistance = 0;
  let closestCoordinate = coordinates[0];
  let closestDelta = Math.abs(position - cumulativeDistance);

  for (let i = 1; i < coordinates.length; i++) {
    cumulativeDistance += haversineDistance(coordinates[i - 1], coordinates[i]);
    const delta = Math.abs(position - cumulativeDistance);
    if (delta < closestDelta) {
      closestDelta = delta;
      closestCoordinate = coordinates[i];
    }
  }

  return closestCoordinate;
};

export const getStartWaypoint = (coordinates: Coordinates[]): Waypoint => {
  const firstCoordinate = coordinates[0] ?? { lat: 0, lng: 0 };
  return {
    id: 'start',
    name: 'Start',
    description: 'The start of the route',
    coordinates: {
      lat: firstCoordinate.lat,
      lng: firstCoordinate.lng,
    },
    type: 'start',
    position: 0,
  };
};

export const getEndWaypoint = (coordinates: Coordinates[]): Waypoint => {
  const lastCoordinate = coordinates[coordinates.length - 1] ?? {
    lat: 0,
    lng: 0,
  };
  return {
    id: 'end',
    name: 'End',
    description: 'The end of the route',
    coordinates: {
      lat: lastCoordinate.lat,
      lng: lastCoordinate.lng,
    },
    type: 'end',
    position: calculateDistance(coordinates),
  };
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
