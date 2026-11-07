import { formatNumber } from '~/utils';

import type { WidgetBaseProps } from '../../types';
import { WidgetContainer } from '../WidgetContainer';

interface DistanceWidgetProps extends WidgetBaseProps {
  distance: number;
  displayDistance?: number;
}

export const DistanceWidget = ({
  distance,
  displayDistance,
  ...props
}: DistanceWidgetProps) => {
  const formattedDistance = `${formatNumber(displayDistance ?? distance, 1)} km`;

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
