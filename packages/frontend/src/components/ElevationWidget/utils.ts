import type { Elevation } from '~/types';

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
