import type { Waypoint } from '~/types';
import { cn } from '~/utils';
import { Icon } from '~/primitives/Icon';

interface RouteLineItemProps {
  index: number;
  currentWaypoint: Waypoint;
  waypoints: Waypoint[];
  drawerWidth: number;
}

const START_END_RADIUS = 14;
const WAYPOINT_RADIUS = 12;
const START_END_BORDER_WIDTH = 4;
const WAYPOINT_BORDER_WIDTH = 3;

export const RouteLineItem = ({
  index,
  currentWaypoint,
  waypoints,
  drawerWidth,
}: RouteLineItemProps) => {
  const isStart = index === 0;
  const isEnd = index === waypoints.length - 1;
  const isStartOrEnd = isStart || isEnd;
  const radius = isStartOrEnd ? START_END_RADIUS : WAYPOINT_RADIUS;
  const bgColor = isStart
    ? 'bg-success-500'
    : isEnd
      ? 'bg-error-500'
      : 'bg-secondary-500';
  const borderWidth = isStartOrEnd
    ? START_END_BORDER_WIDTH
    : WAYPOINT_BORDER_WIDTH;

  return (
    <div
      key={currentWaypoint.id}
      className="absolute"
      style={{
        left: index * drawerWidth - radius,
        top: -radius + borderWidth / 2,
      }}
    >
      <div
        className={cn(
          bgColor,
          'flex items-center justify-center rounded-full border-white shadow-md/30',
        )}
        style={{
          width: radius * 2,
          height: radius * 2,
          borderWidth: borderWidth,
        }}
      >
        {!isStartOrEnd && (
          <Icon
            className="size-4 text-white"
            name={currentWaypoint.type === 'energy' ? 'lightning' : 'star'}
          />
        )}
      </div>
    </div>
  );
};
