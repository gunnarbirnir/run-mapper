import type { ReactNode } from 'react';
import { motion } from 'motion/react';

import {
  WIDGET_ANIMATION_DURATION,
  DEFAULT_FADE_IN_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { Text } from '~/primitives';

interface WidgetContentProps {
  children?: ReactNode;
  label?: string;
  text?: string;
  isActive: boolean;
  isOpen: boolean;
}

export const WidgetContent = ({
  children = null,
  label,
  text,
  isActive,
  isOpen,
}: WidgetContentProps) => {
  if (label && text) {
    return (
      <div className="flex flex-col gap-1 text-center">
        <motion.div
          animate={isActive ? { scale: 1.3, translateY: '50%' } : undefined}
          transition={{
            duration: WIDGET_ANIMATION_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          <Text className="text-xs whitespace-nowrap text-gray-500 uppercase select-none">
            {label}
          </Text>
        </motion.div>
        <motion.div
          animate={isOpen ? { opacity: 0 } : undefined}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          <Text className="text-xl font-bold whitespace-nowrap text-black select-none">
            {text}
          </Text>
        </motion.div>
      </div>
    );
  }

  return children;
};
