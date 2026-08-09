import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '~/utils';
import { DEFAULT_FADE_IN_DURATION, DEFAULT_EASING } from '~/constants';

interface StatusMessageProps {
  status: 'success' | 'error' | 'warning' | 'info';
  children: string;
  autoClear?: boolean;
  className?: string;
}

const CLEAR_DELAY = 3000;
const STATUS_CLASSES = {
  success: 'text-success-800 bg-success-100',
  error: 'text-error-800 bg-error-100',
  warning: 'text-warning-800 bg-warning-100',
  info: 'text-secondary-800 bg-secondary-100',
};

export const StatusMessage = ({
  status,
  children,
  autoClear = false,
  className,
}: StatusMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);

    if (!autoClear) {
      return;
    }
    const timeout = setTimeout(() => setIsVisible(false), CLEAR_DELAY);

    return () => {
      clearTimeout(timeout);
    };
  }, [autoClear, children, status]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
          className={cn(
            'flex rounded-xl px-4 py-2 text-sm',
            STATUS_CLASSES[status],
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
