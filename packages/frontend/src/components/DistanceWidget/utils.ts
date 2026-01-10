import type { Coordinates } from '~/types';
import { haversineDistance } from '~/utils';

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
