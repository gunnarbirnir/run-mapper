import { motion } from 'motion/react';

import type { Waypoint } from '~/types';
import { WaypointIcon } from '~/components/LocationIcon';
import { Text } from '~/primitives';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

interface WaypointItemProps {
  waypoint: Waypoint;
  onEditWaypoint: (id: string) => void;
}

export const WaypointItem = ({
  waypoint: { id, name, type },
  onEditWaypoint,
}: WaypointItemProps) => {
  return (
    <motion.div
      layout
      transition={{
        ease: DEFAULT_EASING,
        duration: DEFAULT_FADE_IN_DURATION,
      }}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
      onClick={() => onEditWaypoint(id)}
    >
      <WaypointIcon type={type} />
      <Text className="mt-0.5 truncate">{name}</Text>
    </motion.div>
  );
};
