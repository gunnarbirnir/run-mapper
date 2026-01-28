import type { Elevation } from '~/types';

// This should all be calculated in backend

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
