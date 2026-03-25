import { motion } from 'framer-motion';
import { useRef, useCallback } from 'react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { useFocusedElementHotkeys } from '~/hooks/useFocusedElementHotkeys';
import { Text } from '~/primitives';
import { PointOfInterest } from '~/types';
import { cn } from '~/utils';

interface PointOfInterestNestedItemProps {
  pointOfInterest: PointOfInterest;
  isClickable: boolean;
  index: number;
  tabIndex: number;
  setActivePointOfInterest: (poiId: string) => void;
}

const ANIMATION_STAGGER = 0.05;

export const PointOfInterestNestedItem = ({
  pointOfInterest,
  isClickable,
  index,
  tabIndex,
  setActivePointOfInterest,
}: PointOfInterestNestedItemProps) => {
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
    <div className="flex items-center gap-2">
      <div className="size-2.5 shrink-0 rounded-full bg-gray-600" />
      <motion.div
        ref={itemRef}
        tabIndex={tabIndex}
        initial={{ opacity: 0, translateX: 10 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{
          duration: DEFAULT_FADE_IN_DURATION + index * ANIMATION_STAGGER,
          ease: DEFAULT_EASING,
        }}
        className={cn('w-full min-w-0 rounded-md px-2 py-0.5', {
          'cursor-pointer hover:bg-gray-200': isClickable,
        })}
        onClick={handleClick}
      >
        <Text className="truncate text-sm text-gray-700">
          {pointOfInterest.name}
        </Text>
      </motion.div>
    </div>
  );
};
