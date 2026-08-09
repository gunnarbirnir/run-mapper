import type { BoundingBox, Coordinates } from '../types/index.js';

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
