import { useMemo } from 'react';

import { WidgetContainer } from '~/components/WidgetContainer';
import type { Coordinates } from '~/types';

import { calculateDistance } from './utils';

export interface DistanceWidgetProps {
  coordinates: Coordinates[];
}

export const DistanceWidget = ({ coordinates }: DistanceWidgetProps) => {
  const distance = useMemo(() => calculateDistance(coordinates), [coordinates]);
  const formattedDistance = `${distance.toFixed(1)} km`;

  return <WidgetContainer label="Distance" text={formattedDistance} />;
};
