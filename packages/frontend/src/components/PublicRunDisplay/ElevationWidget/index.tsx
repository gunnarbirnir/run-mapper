import { useMemo } from 'react';

import type { Elevation, WidgetBaseProps } from '~/types';
import { ListItem } from '~/primitives';
import {
  calculateElevationGain,
  calculateElevationLoss,
  calculateMaxElevation,
  calculateMinElevation,
} from '~/utils/route';

import { WidgetContainer } from '../WidgetContainer';

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
      title="Elevation"
      text={formattedElevation}
      showGraphWhileActive
      icon="mountain"
      iconClassName="translate-y-[-4px]"
    >
      <div className="flex flex-col items-center">
        <ListItem.Container className="w-full max-w-lg px-4">
          <ListItem
            label="Elevation gain"
            value={formattedElevation}
            icon="arrowTrendingUp"
            iconClassName="size-6"
          />
          <ListItem
            label="Elevation loss"
            value={formattedElevationLoss}
            icon="arrowTrendingDown"
            iconClassName="size-6"
          />
          <ListItem
            label="Net elevation"
            value={formattedNetElevation}
            icon="arrowUpDown"
          />
          <ListItem
            label="Max elevation"
            value={formattedMaxElevation}
            icon="doubleArrow"
          />
          <ListItem
            label="Min elevation"
            value={formattedMinElevation}
            icon="doubleArrow"
            iconClassName="rotate-180"
          />
        </ListItem.Container>
      </div>
    </WidgetContainer>
  );
};
