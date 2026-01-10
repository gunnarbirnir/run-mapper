import { Elevation } from '~/types';

export const processElevationData = (elevations: Elevation[]): Elevation[] => {
  const elevationData: Elevation[] = [];
  let currentKm = 0;
  let closestIndex = 0;
  let closestDiff = Infinity;

  // Round to whole number so x-axis labels look better
  const updateClosestDistance = (updatedKm: number = 0) => {
    elevationData[closestIndex].distance = currentKm;
    currentKm = updatedKm;
    closestDiff = Infinity;
  };

  elevations.forEach((elevation, index) => {
    const roundedKm = Math.round(elevation.distance);
    if (roundedKm !== currentKm) {
      updateClosestDistance(roundedKm);
    }

    const diffFromCurrent = Math.abs(elevation.distance - currentKm);
    if (diffFromCurrent < closestDiff) {
      closestDiff = diffFromCurrent;
      closestIndex = index;
    }

    elevationData.push({ ...elevation });
  });

  updateClosestDistance();

  return elevationData;
};
