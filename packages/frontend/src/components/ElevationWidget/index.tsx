import { useMemo } from 'react';

import { WidgetContainer } from '~/components/WidgetContainer';

import { calculateElevationGain } from './utils';

export interface ElevationWidgetProps {
  elevations: number[];
}

export const ElevationWidget = ({ elevations }: ElevationWidgetProps) => {
  const elevationGain = useMemo(
    () => calculateElevationGain(elevations),
    [elevations],
  );
  const formattedElevation = `${Math.round(elevationGain)} m`;

  return <WidgetContainer label="Elevation" text={formattedElevation} />;
};
