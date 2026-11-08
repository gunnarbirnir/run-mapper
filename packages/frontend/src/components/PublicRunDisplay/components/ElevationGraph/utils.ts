import { RouteCoordinates } from '~/types';

export const getElevationGraphData = (
  coordinates: RouteCoordinates[],
): { value: number; distance: number }[] => {
  if (coordinates.length === 0) {
    return [];
  }

  const elevationData: { value: number; distance: number }[] = [];
  let currentKm = 0;
  let closestIndex = 0;
  let closestDiff = Infinity;

  // Round to whole number so x-axis labels look better
  const updateClosestDistance = (updatedKm: number = 0) => {
    elevationData[closestIndex].distance = currentKm;
    currentKm = updatedKm;
    closestDiff = Infinity;
  };

  coordinates.forEach((coord, index) => {
    const distance = coord.distance ?? 0;
    const roundedKm = Math.round(distance);
    if (roundedKm !== currentKm) {
      updateClosestDistance(roundedKm);
    }

    const diffFromCurrent = Math.abs(distance - currentKm);
    if (diffFromCurrent < closestDiff) {
      closestDiff = diffFromCurrent;
      closestIndex = index;
    }

    elevationData.push({ value: coord.elevation ?? 0, distance });
  });

  return elevationData;
};

export const getActiveIndexValue = (
  activeIndex: string | number | null | undefined,
) => {
  if (activeIndex === null || activeIndex === undefined) {
    return null;
  }
  return typeof activeIndex === 'number' ? activeIndex : parseInt(activeIndex);
};
