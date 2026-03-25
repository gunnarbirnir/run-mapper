import { motion } from 'framer-motion';

import { PointOfInterest } from '~/types';
import { Text, Icon } from '~/primitives';
import { getWaypointPoiLabel } from '~/utils/route';
import { cn } from '~/utils';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

import { PointOfInterestIcon } from './PointOfInterestIcon';

interface PointOfInterestGroupProps {
  pointsOfInterest: PointOfInterest[];
  isClickable: boolean;
  isExpanded: boolean;
  tabIndex: number;
  setActivePointOfInterest: (poiId: string) => void;
  toggleExpanded: (groupId: string) => void;
}

const ANIMATION_STAGGER = 0.05;

export const PointOfInterestGroup = ({
  pointsOfInterest,
  isClickable,
  isExpanded,
  tabIndex,
  setActivePointOfInterest,
  toggleExpanded,
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
        tabIndex={tabIndex}
      >
        <PointOfInterestIcon type={poiItem.type} />
        <Text>{poiItem.name}</Text>
      </div>
    );
  }

  const groupType = pointsOfInterest[0].type;
  const groupLabel = getWaypointPoiLabel(groupType);

  return (
    <div className="relative">
      <div className="absolute top-2 bottom-3.5 left-4 z-0 w-0.5 bg-gray-300" />
      <div
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
        <div
          className="relative mt-1 ml-3 flex flex-col gap-1"
          tabIndex={tabIndex}
        >
          {pointsOfInterest.map((poi, index) => (
            <div key={poi.id} className="flex items-center gap-2">
              <div className="size-2.5 shrink-0 rounded-full bg-gray-600" />
              <motion.div
                initial={{ opacity: 0, translateX: 10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  duration:
                    DEFAULT_FADE_IN_DURATION + index * ANIMATION_STAGGER,
                  ease: DEFAULT_EASING,
                }}
                className={cn('w-full rounded-md px-2 py-0.5', {
                  'cursor-pointer hover:bg-gray-200': isClickable,
                })}
                onClick={() =>
                  isClickable ? setActivePointOfInterest(poi.id) : undefined
                }
              >
                <Text className="text-sm text-gray-700">{poi.name}</Text>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
