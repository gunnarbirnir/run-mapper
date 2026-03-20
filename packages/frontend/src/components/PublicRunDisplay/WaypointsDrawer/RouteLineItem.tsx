import type { Waypoint, InnerWayPointType } from '~/types';
import { cn, convertRemToPixels } from '~/utils';
import { getWaypointIconSize } from '~/utils/route';
import { Icon, type IconName } from '~/primitives/Icon';

interface RouteLineItemProps {
  index: number;
  currentWaypoint: Waypoint;
  waypoints: Waypoint[];
  drawerWidth: number;
}

// size 6
const START_END_ITEM_RADIUS = convertRemToPixels('0.75rem');
// size 6.5
const WAYPOINT_ITEM_RADIUS = convertRemToPixels('0.8125rem');
const START_END_BORDER_WIDTH = 4;
const WAYPOINT_BORDER_WIDTH = 3;

const ICONS: Record<InnerWayPointType, IconName> = {
  energy: 'lightning',
  entertainment: 'star',
  hydration: 'drop',
  timing: 'clock',
  restrooms: 'toilet',
};

export const RouteLineItem = ({
  index,
  currentWaypoint,
  waypoints,
  drawerWidth,
}: RouteLineItemProps) => {
  const isStart = index === 0;
  const isEnd = index === waypoints.length - 1;
  const isStartOrEnd = isStart || isEnd;
  const bgColor = isStart
    ? 'bg-success-500'
    : isEnd
      ? 'bg-error-500'
      : 'bg-secondary-500';
  const itemRadius = isStartOrEnd
    ? START_END_ITEM_RADIUS
    : WAYPOINT_ITEM_RADIUS;
  const borderWidth = isStartOrEnd
    ? START_END_BORDER_WIDTH
    : WAYPOINT_BORDER_WIDTH;

  return (
    <div
      key={currentWaypoint.id}
      className="absolute"
      style={{
        left: index * drawerWidth - itemRadius,
        top: -itemRadius + borderWidth / 2,
      }}
    >
      <div
        className={cn(
          bgColor,
          'flex items-center justify-center rounded-full border-white shadow-md/30',
        )}
        style={{
          width: itemRadius * 2,
          height: itemRadius * 2,
          borderWidth,
        }}
      >
        {!isStartOrEnd && (
          <Icon
            className={cn(
              'text-white',
              getWaypointIconSize(currentWaypoint.type).size,
            )}
            name={ICONS[currentWaypoint.type as InnerWayPointType]}
          />
        )}
      </div>
    </div>
  );
};
