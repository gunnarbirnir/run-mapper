import { useRef } from 'react';

import { PointOfInterest } from '~/types';
import { Text, Icon } from '~/primitives';
import { getWaypointPoiLabel } from '~/utils/route';
import { cn } from '~/utils';
import { DEFAULT_FADE_IN_DURATION } from '~/constants';
import { useFocusedElementHotkeys } from '~/hooks/useFocusedElementHotkeys';

import { PointOfInterestIcon } from './PointOfInterestIcon';
import { PointOfInterestItem } from './PointOfInterestItem';
import { PointOfInterestNestedItem } from './PointOfInterestNestedItem';

interface PointOfInterestGroupProps {
  pointsOfInterest: PointOfInterest[];
  isClickable: boolean;
  isExpanded: boolean;
  tabIndex: number;
  setActivePointOfInterest: (poiId: string) => void;
  toggleExpanded: (groupId: string) => void;
}

export const PointOfInterestGroup = ({
  pointsOfInterest,
  isClickable,
  isExpanded,
  tabIndex,
  setActivePointOfInterest,
  toggleExpanded,
}: PointOfInterestGroupProps) => {
  const groupRef = useRef<HTMLDivElement>(null);

  useFocusedElementHotkeys({
    containerRef: groupRef,
    enterEnabled: isClickable,
    onEnter: () => toggleExpanded(pointsOfInterest[0].type),
  });

  if (pointsOfInterest.length === 0) {
    return null;
  }

  const isSingleItem = pointsOfInterest.length === 1;

  if (isSingleItem) {
    return (
      <PointOfInterestItem
        key={pointsOfInterest[0].id}
        pointOfInterest={pointsOfInterest[0]}
        isClickable={isClickable}
        tabIndex={tabIndex}
        setActivePointOfInterest={setActivePointOfInterest}
      />
    );
  }

  const groupType = pointsOfInterest[0].type;
  const groupLabel = getWaypointPoiLabel(groupType);

  return (
    <div className="relative">
      <div className="absolute top-2 bottom-3.5 left-4 z-0 w-0.5 bg-gray-300" />
      <div
        ref={groupRef}
        className="relative flex cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-0.5 hover:bg-gray-200"
        onClick={() => toggleExpanded(groupType)}
        tabIndex={tabIndex}
      >
        <div className="flex items-center gap-2">
          <PointOfInterestIcon type={groupType} />
          <Text>{groupLabel}</Text>
        </div>
        <Icon
          name="chevron"
          className={cn('size-4 rotate-90 transition-transform ease-out', {
            'rotate-180': isExpanded,
          })}
          style={{
            transitionDuration: `${DEFAULT_FADE_IN_DURATION * 1000}ms`,
          }}
        />
      </div>
      {isExpanded && (
        <div className="relative mt-1 ml-3 flex flex-col gap-1">
          {pointsOfInterest.map((pointOfInterest, index) => (
            <PointOfInterestNestedItem
              key={pointOfInterest.id}
              pointOfInterest={pointOfInterest}
              isClickable={isClickable}
              index={index}
              tabIndex={tabIndex}
              setActivePointOfInterest={setActivePointOfInterest}
            />
          ))}
        </div>
      )}
    </div>
  );
};
