import { useMemo } from 'react';

import type { Coordinates, WidgetBaseProps } from '~/types';
import { calculateDistance } from '~/utils/route';

import { WidgetContainer } from '../WidgetContainer';

interface DistanceWidgetProps extends WidgetBaseProps {
  coordinates: Coordinates[];
}

export const DistanceWidget = ({
  coordinates,
  ...props
}: DistanceWidgetProps) => {
  const distance = useMemo(() => calculateDistance(coordinates), [coordinates]);
  const formattedDistance = `${distance.toFixed(1)} km`;

  return <WidgetContainer {...props} text={formattedDistance} icon="ruler" />;
};
