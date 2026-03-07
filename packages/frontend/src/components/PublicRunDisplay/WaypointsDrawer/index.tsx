import { Drawer, Text, RoundButton, Icon } from '~/primitives';
import type { Waypoint } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { PUBLIC_RUN_DISPLAY_MIN_WIDTH } from '~/constants';
import { formatNumber } from '~/utils';

import { RouteLine } from './RouteLine';

interface WaypointsDrawerProps {
  isOpen: boolean;
  width: number;
  waypoints: Waypoint[];
  activeWaypoint: string | null;
  toggleDrawer: () => void;
  setActiveWaypoint: (waypoint: Waypoint) => void;
}

export const WaypointsDrawer = ({
  isOpen,
  width,
  activeWaypoint,
  waypoints,
  toggleDrawer,
  setActiveWaypoint,
}: WaypointsDrawerProps) => {
  const { isSmallScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const activeWidth = isSmallScreen
    ? Math.max(windowWidth, PUBLIC_RUN_DISPLAY_MIN_WIDTH)
    : width;

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
      width={activeWidth}
      className="pointer-events-auto z-20 h-full"
    >
      <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto pt-6">
        <div className="mb-4 flex items-center justify-between px-4">
          <Text element="h2">{activeWaypointDetails.name}</Text>
          {isSmallScreen && (
            <RoundButton onClick={toggleDrawer}>
              <Icon name="close" className="size-6" />
            </RoundButton>
          )}
        </div>
        <div className="relative">
          <RouteLine
            waypoints={waypoints}
            drawerWidth={activeWidth}
            activeWaypointIndex={activeWaypointIndex}
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-between px-4 pb-6">
          <div className="flex w-full flex-col gap-4 pt-8">
            <Text variant="bold">
              {formatNumber(activeWaypointDetails.distance)} km
            </Text>
            <Text variant="subtle" className="text-sm">
              {activeWaypointDetails.description}
            </Text>
          </div>
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
