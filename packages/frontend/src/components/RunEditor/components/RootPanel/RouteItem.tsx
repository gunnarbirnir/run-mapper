import { motion } from 'motion/react';

import type { PublicRoute } from '~/types';
import { Text } from '~/primitives';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { formatNumber } from '~/utils';

interface RouteItemProps {
  route: PublicRoute;
  onEditRoute: (id: string) => void;
}

export const RouteItem = ({
  route: { id, name, distance, displayDistance },
  onEditRoute,
}: RouteItemProps) => {
  const formattedDistance = displayDistance
    ? `${formatNumber(displayDistance, 2)} km`
    : `${formatNumber(distance, 2)} km`;

  return (
    <motion.button
      layout
      transition={{
        ease: DEFAULT_EASING,
        duration: DEFAULT_FADE_IN_DURATION,
      }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
      onClick={() => onEditRoute(id)}
      type="button"
    >
      <Text className="bg-secondary-200 shrink-0 rounded-md px-1.5 py-0.5 text-sm font-medium">
        {formattedDistance}
      </Text>
      <Text className="mt-0.5 truncate">{name}</Text>
    </motion.button>
  );
};
