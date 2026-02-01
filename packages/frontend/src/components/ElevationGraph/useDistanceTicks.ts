import type { Elevation } from '~/types';

import { useWindowDimensions } from '~/hooks/useWindowDimensions';

interface UseDistanceTicksProps {
  elevationData: Elevation[];
}

export const useDistanceTicks = ({ elevationData }: UseDistanceTicksProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const maxDistanceTicks = Math.ceil(windowWidth / 100);
  const lastDistance = elevationData[elevationData.length - 1].distance;
  const lastKm = Math.floor(lastDistance);
  const allKms = Array.from({ length: lastKm }, (_, i) => i + 1);
  const interval = Math.ceil(lastKm / maxDistanceTicks);
  const ticks = allKms.filter((value) => value % interval === 0);

  return { ticks, lastDistance };
};
