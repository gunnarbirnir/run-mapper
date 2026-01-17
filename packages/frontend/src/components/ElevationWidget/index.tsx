import { useMemo } from 'react';

import { WidgetContainer } from '~/components/WidgetContainer';
import type { Elevation, WidgetBaseProps } from '~/types';

import { calculateElevationGain } from './utils';

export interface ElevationWidgetProps extends WidgetBaseProps {
  elevations: Elevation[];
}

export const ElevationWidget = ({
  elevations,
  ...props
}: ElevationWidgetProps) => {
  const elevationGain = useMemo(
    () => calculateElevationGain(elevations),
    [elevations],
  );
  const formattedElevation = `${Math.round(elevationGain)} m`;

  return (
    <WidgetContainer
      {...props}
      label="Elevation"
      text={formattedElevation}
      showGraphWhileActive
    />
  );
};
