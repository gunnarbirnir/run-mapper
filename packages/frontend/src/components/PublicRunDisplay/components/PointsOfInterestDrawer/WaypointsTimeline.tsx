import { Waypoint } from '~/types';

import { WaypointItem } from './WaypointItem';

interface WaypointsTimelineProps {
  waypoints: Waypoint[];
  isClickable: boolean;
  tabIndex: number;
  setActiveWaypoint: (waypointId: string) => void;
}

export const WaypointsTimeline = ({
  waypoints,
  isClickable,
  tabIndex,
  setActiveWaypoint,
}: WaypointsTimelineProps) => {
  return (
    <div className="relative mx-1">
      <div className="bg-primary-500 absolute top-2 bottom-2 left-2.75 z-0 w-1" />
      <div className="relative flex flex-col gap-2">
        {waypoints.map((waypoint) => (
          <WaypointItem
            key={waypoint.id}
            waypoint={waypoint}
            isClickable={isClickable}
            tabIndex={tabIndex}
            setActiveWaypoint={setActiveWaypoint}
          />
        ))}
      </div>
    </div>
  );
};
