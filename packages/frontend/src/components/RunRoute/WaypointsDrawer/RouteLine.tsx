import { motion } from 'motion/react';

import type { Waypoint } from '~/types';

import { RouteLineItem } from './RouteLineItem';

const ANIMATION_DURATION = 0.15;
const ANIMATION_BOUNCE = 0.2;

interface RouteLineProps {
  waypoints: Waypoint[];
  activeWaypointIndex: number;
  drawerWidth: number;
}

export const RouteLine = ({
  drawerWidth,
  waypoints,
  activeWaypointIndex,
}: RouteLineProps) => {
  return (
    <motion.div
      className="absolute"
      style={{ left: drawerWidth / 2 }}
      animate={{
        translateX: -activeWaypointIndex * drawerWidth,
      }}
      transition={{
        duration: ANIMATION_DURATION,
        type: 'spring',
        bounce: ANIMATION_BOUNCE,
      }}
    >
      <div
        className="bg-primary-500"
        style={{ width: drawerWidth * (waypoints.length - 1), height: 4 }}
      />
      {waypoints.map((waypoint, index) => (
        <RouteLineItem
          key={waypoint.id}
          index={index}
          currentWaypoint={waypoint}
          waypoints={waypoints}
          drawerWidth={drawerWidth}
        />
      ))}
    </motion.div>
  );
};
