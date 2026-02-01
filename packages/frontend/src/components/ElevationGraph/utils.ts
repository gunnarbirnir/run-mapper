import { Elevation } from '~/types';
import {
  ELEVATION_GRAPH_HEIGHT,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
} from '~/constants';

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

export const getActiveIndexValue = (
  activeIndex: string | number | null | undefined,
) => {
  if (activeIndex === null || activeIndex === undefined) {
    return null;
  }
  return typeof activeIndex === 'number' ? activeIndex : parseInt(activeIndex);
};

const MIN_ELEVATION_TICK_HEIGHT = 50;

export const generateElevationTicks =
  (isExpanded: boolean) =>
  ({
    yAxis,
  }: {
    yAxis?: {
      niceTicks?: readonly (number | string)[];
      scale?: (value: number | string) => number;
    };
  }): number[] => {
    const { niceTicks = [], scale = () => 0 } = yAxis ?? {};
    let ticks = niceTicks.filter(Boolean).map(scale);
    const graphHeight = isExpanded
      ? EXPANDED_ELEVATION_GRAPH_HEIGHT
      : ELEVATION_GRAPH_HEIGHT;

    while (
      ticks.length > 0 &&
      graphHeight / ticks.length < MIN_ELEVATION_TICK_HEIGHT
    ) {
      ticks = ticks
        // Reverse to always keep the last tick
        .reverse()
        .filter((_, index) => index % 2 === 0)
        .reverse();
    }

    return ticks;
  };
