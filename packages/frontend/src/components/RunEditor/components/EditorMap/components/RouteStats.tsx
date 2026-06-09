import { motion } from 'motion/react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { Icon, Text } from '~/primitives';
import { SLIDE_IN_DURATION } from '~/primitives/SidePanel';

interface RouteStatsProps {
  distance: number;
  elevationGain: number;
}

const FADE_IN_DISTANCE = 10;

export const RouteStats = ({ distance, elevationGain }: RouteStatsProps) => {
  const formattedDistance = `${distance.toFixed(1)} km`;
  const formattedElevation = `${Math.round(elevationGain)} m`;

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -FADE_IN_DISTANCE }}
      exit={{ opacity: 0, translateX: -FADE_IN_DISTANCE }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        duration: DEFAULT_FADE_IN_DURATION,
        delay: SLIDE_IN_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="absolute top-3 left-3 z-10 flex items-center gap-3 rounded-xl bg-white px-3 py-1.5 shadow-md"
    >
      <div className="flex items-center gap-2">
        <Icon name="ruler" className="text-primary-500 size-6.5" />
        <Text variant="bold" className="text-sm whitespace-nowrap">
          {formattedDistance}
        </Text>
      </div>
      <div className="h-6 w-px bg-gray-300" />
      <div className="flex items-center gap-2">
        <Icon
          name="mountain"
          className="text-primary-500 size-7 -translate-y-1"
        />
        <Text variant="bold" className="text-sm whitespace-nowrap">
          {formattedElevation}
        </Text>
      </div>
    </motion.div>
  );
};
