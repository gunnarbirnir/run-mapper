import type { Coordinates, Elevation, Waypoint } from '~/types';

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

export const getStartWaypoint = (coordinates: Coordinates[]): Waypoint => {
  const firstCoordinate = coordinates[0] ?? [0, 0];
  return {
    id: 'start',
    name: 'Start',
    description: 'The start of the route',
    coordinates: {
      lat: firstCoordinate.lat,
      lng: firstCoordinate.lng,
    },
    type: 'start',
    distance: 0,
  };
};

export const getEndWaypoint = (coordinates: Coordinates[]): Waypoint => {
  const lastCoordinate = coordinates[coordinates.length - 1] ?? [0, 0];
  return {
    id: 'end',
    name: 'End',
    description: 'The end of the route',
    coordinates: {
      lat: lastCoordinate.lat,
      lng: lastCoordinate.lng,
    },
    type: 'end',
    distance: calculateDistance(coordinates),
  };
};
