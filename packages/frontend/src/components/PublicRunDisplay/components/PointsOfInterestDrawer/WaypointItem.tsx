import { useRef, useCallback } from 'react';

import { Waypoint } from '~/types';
import { Text } from '~/primitives';
import { cn } from '~/utils';
import { useFocusedElementHotkeys } from '~/hooks/useFocusedElementHotkeys';

import { WaypointIcon } from './WaypointIcon';

interface WaypointItemProps {
  waypoint: Waypoint;
  isClickable: boolean;
  tabIndex: number;
  setActiveWaypoint: (waypointId: string) => void;
}

export const WaypointItem = ({
  waypoint,
  isClickable,
  tabIndex,
  setActiveWaypoint,
}: WaypointItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (isClickable) {
      setActiveWaypoint(waypoint.id);
    }
  }, [isClickable, waypoint.id, setActiveWaypoint]);

  useFocusedElementHotkeys({
    containerRef: itemRef,
    enterEnabled: isClickable,
    onEnter: handleClick,
  });

  return (
    <div key={waypoint.id} className="flex items-center gap-1">
      <WaypointIcon type={waypoint.type} />
      <div
        ref={itemRef}
        tabIndex={tabIndex}
        onClick={handleClick}
        className={cn('w-full min-w-0 rounded-md px-1 py-0.5', {
          'cursor-pointer hover:bg-gray-200': isClickable,
        })}
      >
        <Text className="truncate">{waypoint.name}</Text>
      </div>
    </div>
  );
};
