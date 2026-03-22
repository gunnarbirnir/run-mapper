import { useMemo } from 'react';

import type { Coordinates } from '~/types';
import { calculateDistance } from '~/utils/route';

import type { WidgetBaseProps } from '../../types';
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

  return (
    <WidgetContainer
      {...props}
      title="Distance"
      text={formattedDistance}
      icon="ruler"
      iconClassName="size-6.5"
    />
  );
};
