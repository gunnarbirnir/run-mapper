import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Coordinates, Elevation, Waypoint } from '~/types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCssVariableValue = (variable: string) => {
  try {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue(variable);
  } catch {
    return '';
  }
};

export const areCssVariablesLoaded = () => {
  return getCssVariableValue('--color-primary-500') !== '';
};

export const convertRemToPixels = (rem: string) => {
  try {
    const remNum = parseFloat(rem.replace('rem', ''));
    return (
      remNum * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch {
    return 0;
  }
};

const BASE_SPACING = 0.25;

export const spacingRem = (factor: number) => {
  return `${BASE_SPACING * factor}rem`;
};

export const spacingPx = (factor: number) => {
  try {
    const spacingVal = BASE_SPACING * factor;

    return (
      spacingVal *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch {
    return 0;
  }
};

export const haversineDistance = (
  coord1: Coordinates,
  coord2: Coordinates,
): number => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

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
  return {
    id: 'start',
    name: 'Start',
    description: 'The start of the route',
    coordinates: {
      lat: coordinates[0][0] as number,
      lng: coordinates[0][1] as number,
    },
    type: 'start',
  };
};

export const getEndWaypoint = (coordinates: Coordinates[]): Waypoint => {
  return {
    id: 'end',
    name: 'End',
    description: 'The end of the route',
    coordinates: {
      lat: coordinates[coordinates.length - 1][0] as number,
      lng: coordinates[coordinates.length - 1][1] as number,
    },
    type: 'end',
  };
};
