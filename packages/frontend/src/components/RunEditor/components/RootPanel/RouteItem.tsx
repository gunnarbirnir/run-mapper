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
  route: { id, name, displayDistance },
  onEditRoute,
}: RouteItemProps) => {
  return (
    <motion.div
      layout
      transition={{
        ease: DEFAULT_EASING,
        duration: DEFAULT_FADE_IN_DURATION,
      }}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
      onClick={() => onEditRoute(id)}
    >
      {/* TODO: Use actual distance here and also use to order items */}
      <Text className="shrink-0 rounded-md bg-gray-300 px-2 py-1 text-sm font-medium">
        {displayDistance ? `${formatNumber(displayDistance, 2)} km` : '10 km'}
      </Text>
      <Text className="mt-0.5 truncate">{name}</Text>
    </motion.div>
  );
};
