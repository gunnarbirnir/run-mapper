import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { spacingPx, cn } from '~/utils';

interface ToolbarContainerProps {
  children: ReactNode;
  className?: string;
}

const FADE_IN_DISTANCE = 20;

export const ToolbarContainer = ({
  children,
  className,
}: ToolbarContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: FADE_IN_DISTANCE }}
      exit={{ opacity: 0, translateY: FADE_IN_DISTANCE }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: DEFAULT_FADE_IN_DURATION,
        ease: DEFAULT_EASING,
      }}
      className={cn(
        'absolute left-[50%] translate-x-[-50%] rounded-full bg-white shadow-md',
        className,
      )}
      style={{ bottom: spacingPx(13) }}
    >
      {children}
    </motion.div>
  );
};
