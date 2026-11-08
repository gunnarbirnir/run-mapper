import type { ElevationStats } from '~/types';

import type { WidgetBaseProps } from '../../types';
import { WidgetContainer } from '../WidgetContainer';
import { ListItem } from './ListItem';

export interface ElevationWidgetProps extends WidgetBaseProps {
  elevationStats?: ElevationStats;
}

export const ElevationWidget = ({
  elevationStats,
  ...props
}: ElevationWidgetProps) => {
  const {
    elevationGain = 0,
    elevationLoss = 0,
    netElevation = 0,
    maxElevation = 0,
    minElevation = 0,
  } = elevationStats ?? {};
  const formatStat = (stat: number) => `${Math.round(stat)} m`;

  return (
    <WidgetContainer
      {...props}
      title="Elevation"
      text={formatStat(elevationGain)}
      icon="mountain"
      iconClassName="translate-y-[-4px]"
      showGraphWhileActive
    >
      <div className="flex flex-col items-center">
        <ListItem.Container className="w-full max-w-lg px-4">
          <ListItem
            label="Elevation gain"
            value={formatStat(elevationGain)}
            icon="arrowTrendingUp"
            iconClassName="size-5.5"
          />
          <ListItem
            label="Elevation loss"
            value={formatStat(elevationLoss)}
            icon="arrowTrendingDown"
            iconClassName="size-5.5"
          />
          <ListItem
            label="Net elevation"
            value={formatStat(netElevation)}
            icon="arrowUpDown"
          />
          <ListItem
            label="Max elevation"
            value={formatStat(maxElevation)}
            icon="doubleArrow"
          />
          <ListItem
            label="Min elevation"
            value={formatStat(minElevation)}
            icon="doubleArrow"
            iconClassName="rotate-180"
          />
        </ListItem.Container>
      </div>
    </WidgetContainer>
  );
};
