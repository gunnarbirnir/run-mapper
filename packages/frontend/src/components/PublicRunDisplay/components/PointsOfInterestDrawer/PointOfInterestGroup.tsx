import { PointOfInterest } from '~/types';
import { Text } from '~/primitives';
import { getWaypointPoiLabel } from '~/utils/route';
import { cn } from '~/utils';

import { PointOfInterestIcon } from './PointOfInterestIcon';

interface PointOfInterestGroupProps {
  pointsOfInterest: PointOfInterest[];
  isClickable: boolean;
  setActivePointOfInterest: (poiId: string) => void;
}

export const PointOfInterestGroup = ({
  pointsOfInterest,
  isClickable,
  setActivePointOfInterest,
}: PointOfInterestGroupProps) => {
  if (pointsOfInterest.length === 0) {
    return null;
  }

  const isSingleItem = pointsOfInterest.length === 1;

  if (isSingleItem) {
    const poiItem = pointsOfInterest[0];

    return (
      <div
        className={cn('flex items-center gap-2 rounded-md px-1 py-0.5', {
          'cursor-pointer hover:bg-gray-200': isClickable,
        })}
        onClick={() =>
          isClickable ? setActivePointOfInterest(poiItem.id) : undefined
        }
      >
        <PointOfInterestIcon type={poiItem.type} />
        <Text>{poiItem.name}</Text>
      </div>
    );
  }

  const groupType = pointsOfInterest[0].type;
  const groupLabel = getWaypointPoiLabel(groupType);

  return (
    <div className="flex items-center gap-2 rounded-md px-1 py-0.5">
      <PointOfInterestIcon type={groupType} />
      <Text>{groupLabel}</Text>
    </div>
  );
};
