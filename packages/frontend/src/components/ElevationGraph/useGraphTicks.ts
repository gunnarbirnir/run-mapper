import { useMemo } from 'react';

import type { Elevation } from '~/types';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { calculateMaxElevation, calculateMinElevation } from '~/utils';
import {
  ELEVATION_GRAPH_HEIGHT,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
} from '~/constants';

interface UseGraphTicksProps {
  elevationData: Elevation[];
  isExpanded: boolean;
}

const MIN_X_TICK_WIDTH = 80;
const MIN_Y_TICK_HEIGHT = 40;

export const useGraphTicks = ({
  elevationData,
  isExpanded,
}: UseGraphTicksProps): {
  xTicks: number[];
  lastDistance: number;
  yTicks: number[];
} => {
  const { width: windowWidth } = useWindowDimensions();
  const lastDistance = elevationData[elevationData.length - 1].distance;
  const lastKm = Math.floor(lastDistance);
  const maxXTicks = Math.floor(windowWidth / MIN_X_TICK_WIDTH);
  // -1 because n ticks create n-1 sections
  const xTickStep = Math.ceil(lastKm / Math.max(maxXTicks - 1, 1));

  const xTicks: number[] = [];
  for (let tick = xTickStep; tick <= lastKm; tick += xTickStep) {
    xTicks.push(tick);
  }

  const graphHeight = isExpanded
    ? EXPANDED_ELEVATION_GRAPH_HEIGHT
    : ELEVATION_GRAPH_HEIGHT;
  const maxElevation = useMemo(
    () => calculateMaxElevation(elevationData),
    [elevationData],
  );
  const minElevation = useMemo(
    () => calculateMinElevation(elevationData),
    [elevationData],
  );
  const yStepSize = maxElevation.value - minElevation.value > 50 ? 10 : 5;
  const yMax = Math.ceil(maxElevation.value / yStepSize) * yStepSize;
  let yMin = Math.floor(minElevation.value / yStepSize) * yStepSize;
  yMin = yMin < 0 ? yMin : 0;

  const yRange = yMax - yMin;
  const maxTicks = Math.floor(graphHeight / MIN_Y_TICK_HEIGHT);
  const minYTickStep = yRange / Math.max(maxTicks - 1, 1);

  // Find appropriate tick step (5, 10, or multiple of 10)
  let yTickStep: number;
  if (minYTickStep <= 5) {
    yTickStep = 5;
  } else if (minYTickStep <= 10) {
    yTickStep = 10;
  } else {
    yTickStep = Math.ceil(minYTickStep / 10) * 10;
  }

  const yTicks: number[] = [];
  for (let tick = yMin; tick < yMax; tick += yTickStep) {
    yTicks.push(tick);
  }
  yTicks.push(yMax);

  return { xTicks, lastDistance, yTicks };
};
