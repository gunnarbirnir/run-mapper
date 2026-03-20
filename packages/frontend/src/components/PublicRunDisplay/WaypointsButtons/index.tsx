import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { spacingPx } from '~/utils';
import { RoundButton, Icon } from '~/primitives';
import type { Waypoint } from '~/types';

interface WaypointsButtonsProps {
  waypoints: Waypoint[];
  activeWaypoint: string;
  setActiveWaypoint: (waypoint: string) => void;
  toggleDrawer: () => void;
  resetState: () => void;
}

export const WaypointsButtons = ({
  waypoints,
  activeWaypoint,
  setActiveWaypoint,
  toggleDrawer,
  resetState,
}: WaypointsButtonsProps) => {
  const { height: graphHeight } = useElevationGraphHeight();

  const activeWaypointDetails = waypoints.find(
    (waypoint: Waypoint) => waypoint.id === activeWaypoint,
  );
  const activeWaypointIndex = waypoints.findIndex(
    (waypoint) => waypoint.id === activeWaypoint,
  );
  const previousWaypoint = waypoints[activeWaypointIndex - 1];
  const nextWaypoint = waypoints[activeWaypointIndex + 1];

  if (!activeWaypointDetails) {
    return null;
  }

  return (
    <div
      // Z-index 19 to be below drawer
      className="height-20 width-50 pointer-events-auto absolute left-[50%] z-19 flex translate-x-[-50%] items-center justify-center gap-4 rounded-full bg-white p-2 shadow-md"
      // 8 (height of map action buttons) + 3 (spacing above elevation graph) + 2 (spacing from buttons)
      style={{ bottom: graphHeight + spacingPx(13) }}
    >
      <div className="flex items-center gap-2">
        <RoundButton
          disabled={activeWaypointIndex === 0}
          onClick={() => setActiveWaypoint(previousWaypoint.id)}
        >
          <Icon name="arrow" className="size-5 rotate-270" />
        </RoundButton>
        <RoundButton
          disabled={activeWaypointIndex === waypoints.length - 1}
          onClick={() => setActiveWaypoint(nextWaypoint.id)}
        >
          <Icon name="arrow" className="size-5 rotate-90" />
        </RoundButton>
      </div>
      <div className="flex items-center gap-2">
        <RoundButton color="gray" onClick={toggleDrawer}>
          <Icon name="magnifier" className="size-5" />
        </RoundButton>
        <RoundButton color="gray" onClick={resetState}>
          <Icon name="close" className="size-6" />
        </RoundButton>
      </div>
    </div>
  );
};
