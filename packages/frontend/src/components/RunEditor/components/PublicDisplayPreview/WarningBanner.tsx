import { motion } from 'framer-motion';

import { DEFAULT_EASING } from '~/constants';
import { Text } from '~/primitives';

const SLIDE_IN_DELAY = 0.2;
const SLIDE_IN_DURATION = 0.2;

interface WarningBannerProps {
  onClose: () => void;
}

export const WarningBanner = ({ onClose }: WarningBannerProps) => {
  return (
    <motion.div
      initial={{ translateY: '-100%' }}
      animate={{ translateY: 0 }}
      transition={{
        duration: SLIDE_IN_DURATION,
        ease: DEFAULT_EASING,
        delay: SLIDE_IN_DELAY,
      }}
      className="bg-warning-200 absolute top-0 left-0 flex w-full items-center justify-between gap-4 px-4 py-2"
    >
      <Text className="text-sm">
        This is a preview of what the run will look like on your page.
      </Text>
      <a href="#" onClick={onClose}>
        <Text className="text-sm underline underline-offset-2 hover:text-gray-500">
          Close preview
        </Text>
      </a>
    </motion.div>
  );
};
