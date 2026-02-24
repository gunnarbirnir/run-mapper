import { Drawer, Text, RoundButton, Icon } from '~/primitives';
import type { Waypoint } from '~/types';

import { RouteLine } from './RouteLine';

interface WaypointsDrawerProps {
  isOpen: boolean;
  width: number;
  waypoints: Waypoint[];
  activeWaypoint: string | null;
  setActiveWaypoint: (waypoint: Waypoint) => void;
}

export const WaypointsDrawer = ({
  isOpen,
  width,
  activeWaypoint,
  waypoints,
  setActiveWaypoint,
}: WaypointsDrawerProps) => {
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
    <Drawer
      isOpen={isOpen}
      width={width}
      className="pointer-events-auto z-20 h-full"
    >
      <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto pt-6">
        <Text element="h2" className="mb-4 px-4">
          {activeWaypointDetails.name}
        </Text>
        <div className="relative">
          <RouteLine
            waypoints={waypoints}
            drawerWidth={width}
            activeWaypointIndex={activeWaypointIndex}
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-between px-4 pb-6">
          <Text variant="subtle" className="w-full pt-8 text-sm">
            {activeWaypointDetails.description}
          </Text>
          <div className="mt-4 flex items-center gap-4">
            <RoundButton
              disabled={activeWaypointIndex === 0}
              onClick={() => setActiveWaypoint(previousWaypoint)}
            >
              <Icon name="arrow" className="size-5 rotate-270" />
            </RoundButton>
            <RoundButton
              disabled={activeWaypointIndex === waypoints.length - 1}
              onClick={() => setActiveWaypoint(nextWaypoint)}
            >
              <Icon name="arrow" className="size-5 rotate-90" />
            </RoundButton>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
