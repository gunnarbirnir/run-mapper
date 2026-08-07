import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { Text, Button } from '~/primitives';
import { cn } from '~/utils';
import { DEFAULT_FADE_IN_DURATION, DEFAULT_EASING } from '~/constants';

interface NotVisibleWarningProps {
  children: ReactNode;
  tabIndex: number;
  className?: string;
  onShowClick: () => void;
}

export const NotVisibleWarning = ({
  children,
  tabIndex,
  className,
  onShowClick,
}: NotVisibleWarningProps) => {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DEFAULT_FADE_IN_DURATION, ease: DEFAULT_EASING }}
      className={cn(
        'bg-warning-100 flex flex-col gap-2 rounded-xl px-3 py-2',
        className,
      )}
    >
      <Text className="text-sm text-gray-700">{children}</Text>
      <Button size="small" tabIndex={tabIndex} onClick={onShowClick}>
        Show
      </Button>
    </motion.div>
  );
};
