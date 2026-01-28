import { useMemo } from 'react';

import type { Elevation, WidgetBaseProps } from '~/types';
import { ListItem } from '~/components/ListItem';

import { WidgetContainer } from '../WidgetContainer';
import {
  calculateElevationGain,
  calculateElevationLoss,
  calculateMaxElevation,
  calculateMinElevation,
} from './utils';

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
  const elevationLoss = useMemo(
    () => calculateElevationLoss(elevations),
    [elevations],
  );
  const maxElevation = useMemo(
    () => calculateMaxElevation(elevations),
    [elevations],
  );
  const minElevation = useMemo(
    () => calculateMinElevation(elevations),
    [elevations],
  );

  const formattedElevation = `${Math.round(elevationGain)} m`;
  const formattedElevationLoss = `${Math.round(elevationLoss)} m`;
  const formattedMaxElevation = `${Math.round(maxElevation.value)} m`;
  const formattedMinElevation = `${Math.round(minElevation.value)} m`;
  const formattedNetElevation = `${Math.round(elevationGain) - Math.round(elevationLoss)} m`;

  return (
    <WidgetContainer
      {...props}
      label="Elevation"
      text={formattedElevation}
      showGraphWhileActive
    >
      <div className="flex flex-col items-center">
        <ListItem.Container className="w-full max-w-lg px-4">
          <ListItem label="Elevation gain" value={formattedElevation} />
          <ListItem label="Elevation loss" value={formattedElevationLoss} />
          <ListItem label="Net elevation" value={formattedNetElevation} />
          <ListItem label="Max elevation" value={formattedMaxElevation} />
          <ListItem label="Min elevation" value={formattedMinElevation} />
        </ListItem.Container>
      </div>
    </WidgetContainer>
  );
};
