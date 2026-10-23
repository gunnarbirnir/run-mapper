import { motion } from 'motion/react';

import type { Waypoint } from '~/types';
import { WaypointIcon } from '~/components/LocationIcon';
import { Text } from '~/primitives';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { cn } from '~/utils';

interface WaypointItemProps {
  waypoint: Waypoint;
  error?: boolean;
  disabled?: boolean;
  layoutDependency?: string;
  onEditWaypoint: (id: string) => void;
}

export const WaypointItem = ({
  waypoint: { id, name, type },
  error = false,
  disabled = false,
  layoutDependency,
  onEditWaypoint,
}: WaypointItemProps) => {
  return (
    <motion.button
      layout
      layoutDependency={layoutDependency}
      transition={{
        ease: DEFAULT_EASING,
        duration: DEFAULT_FADE_IN_DURATION,
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg bg-gray-100 px-3 py-2',
        {
          'bg-error-200': error,
          'cursor-pointer hover:bg-gray-200': !disabled,
        },
      )}
      onClick={() => onEditWaypoint(id)}
      disabled={disabled}
      type="button"
    >
      <WaypointIcon type={type} />
      <Text
        className={cn('mt-0.5 truncate', {
          'text-gray-500': disabled,
        })}
      >
        {name}
      </Text>
    </motion.button>
  );
};
