import { useRef, useCallback } from 'react';

import { useFocusedElementHotkeys } from '~/hooks/useFocusedElementHotkeys';
import { Text } from '~/primitives';
import { PointOfInterest } from '~/types';
import { cn } from '~/utils';
import { PointOfInterestIcon } from '~/components/LocationIcon';

interface PointOfInterestItemProps {
  pointOfInterest: PointOfInterest;
  isClickable: boolean;
  tabIndex: number;
  setActivePointOfInterest: (poiId: string) => void;
}

export const PointOfInterestItem = ({
  pointOfInterest,
  isClickable,
  tabIndex,
  setActivePointOfInterest,
}: PointOfInterestItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (isClickable) {
      setActivePointOfInterest(pointOfInterest.id);
    }
  }, [isClickable, pointOfInterest.id, setActivePointOfInterest]);

  useFocusedElementHotkeys({
    containerRef: itemRef,
    enterEnabled: isClickable,
    onEnter: handleClick,
  });

  return (
    <div
      ref={itemRef}
      className={cn('flex items-center gap-2 rounded-md px-1 py-0.5', {
        'cursor-pointer hover:bg-gray-200': isClickable,
      })}
      onClick={handleClick}
      tabIndex={tabIndex}
    >
      <PointOfInterestIcon type={pointOfInterest.type} />
      <Text className="truncate">{pointOfInterest.name}</Text>
    </div>
  );
};
