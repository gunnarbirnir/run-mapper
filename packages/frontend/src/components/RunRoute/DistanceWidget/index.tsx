import { useMemo } from 'react';

import type { Coordinates, WidgetBaseProps } from '~/types';

import { WidgetContainer } from '../WidgetContainer';
import { calculateDistance } from './utils';

interface DistanceWidgetProps extends WidgetBaseProps {
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
