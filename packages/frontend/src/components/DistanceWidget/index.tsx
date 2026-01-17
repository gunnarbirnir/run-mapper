import { useMemo } from 'react';

import { WidgetContainer } from '~/components/WidgetContainer';
import type { Coordinates, WidgetBaseProps } from '~/types';

import { calculateDistance } from './utils';

export interface DistanceWidgetProps extends WidgetBaseProps {
  coordinates: Coordinates[];
}

export const DistanceWidget = ({
  coordinates,
  ...props
}: DistanceWidgetProps) => {
  const distance = useMemo(() => calculateDistance(coordinates), [coordinates]);
  const formattedDistance = `${distance.toFixed(1)} km`;

  return (
    <WidgetContainer {...props} label="Distance" text={formattedDistance} />
  );
};
