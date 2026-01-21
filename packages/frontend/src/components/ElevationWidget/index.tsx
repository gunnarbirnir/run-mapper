import { useMemo } from 'react';

import { WidgetContainer } from '~/components/WidgetContainer';
import type { Elevation, WidgetBaseProps } from '~/types';

import {
  calculateElevationGain,
  calculateElevationLoss,
  calculateMaxElevation,
  calculateMinElevation,
} from './utils';
import { InformationItem } from './InformationItem';

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
  const formattedDifference = `${Math.round(elevationGain) - Math.round(elevationLoss)} m`;
  const formattedNetElevation = `${elevations.length > 1 ? Math.round(elevations[0].value - elevations[elevations.length - 1].value) : 0} m`;

  return (
    <WidgetContainer
      {...props}
      label="Elevation"
      text={formattedElevation}
      showGraphWhileActive
    >
      <div className="flex flex-col items-center">
        <div className="grid w-full max-w-xl gap-4 px-4 sm:grid-cols-2">
          <InformationItem
            label="Elevation gain"
            value={formattedElevation}
            icon="elevation"
          />
          <InformationItem
            label="Elevation loss"
            value={formattedElevationLoss}
            icon="elevation-down"
          />
          <InformationItem
            label="Difference"
            value={formattedDifference}
            icon="arrow-up-down"
            iconClassName="size-5"
          />
          <InformationItem
            label="Net elevation"
            value={formattedNetElevation}
            icon="arrow-up-down"
            iconClassName="size-5 rotate-90"
          />
          <InformationItem
            label="Max elevation"
            value={formattedMaxElevation}
            variant="success"
            icon="double-arrow"
            iconClassName="size-5"
          />
          <InformationItem
            label="Min elevation"
            value={formattedMinElevation}
            variant="error"
            icon="double-arrow"
            iconClassName="size-5 rotate-180"
          />
        </div>
      </div>
    </WidgetContainer>
  );
};
