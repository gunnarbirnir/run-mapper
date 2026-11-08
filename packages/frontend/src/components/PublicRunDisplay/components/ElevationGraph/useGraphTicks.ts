import type { RouteCoordinates } from '~/types';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';

import { useElevationGraphHeight } from '../../hooks/useElevationGraphHeight';

interface UseGraphTicksProps {
  isExpanded: boolean;
  coordinates: RouteCoordinates[];
  maxElevation: number;
  minElevation: number;
}

const MIN_X_TICK_WIDTH = 80;
const MIN_Y_TICK_HEIGHT = 40;

export const useGraphTicks = ({
  isExpanded,
  coordinates,
  maxElevation,
  minElevation,
}: UseGraphTicksProps): {
  xTicks: number[];
  lastDistance: number;
  yTicks: number[];
} => {
  const { width: windowWidth } = useWindowDimensions();
  const { height: graphHeight } = useElevationGraphHeight(isExpanded);
  const lastDistance =
    coordinates.length > 0
      ? (coordinates[coordinates.length - 1].distance ?? 0)
      : 0;
  const lastKm = Math.floor(lastDistance);
  const maxXTicks = Math.floor(windowWidth / MIN_X_TICK_WIDTH);
  // -1 because n ticks create n-1 sections
  const xTickStep = Math.max(1, Math.ceil(lastKm / Math.max(maxXTicks - 1, 1)));

  const xTicks: number[] = [];
  for (let tick = xTickStep; tick <= lastKm; tick += xTickStep) {
    xTicks.push(tick);
  }

  const yStepSize = maxElevation - minElevation > 50 ? 10 : 5;
  const yMax = Math.ceil(maxElevation / yStepSize) * yStepSize;
  let yMin = Math.floor(minElevation / yStepSize) * yStepSize;
  yMin = yMin < 0 ? yMin : 0;

  const yRange = yMax - yMin;
  const maxYTicks = Math.floor(graphHeight / MIN_Y_TICK_HEIGHT);
  const minYTickStep = yRange / Math.max(maxYTicks - 1, 1);

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

  return {
    xTicks,
    lastDistance,
    yTicks: yTicks.length >= 2 ? yTicks : [0, 5],
  };
};
