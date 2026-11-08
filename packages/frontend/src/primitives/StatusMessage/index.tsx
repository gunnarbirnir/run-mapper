import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '~/utils';
import { DEFAULT_FADE_IN_DURATION, DEFAULT_EASING } from '~/constants';

import { RoundButton } from '../Button';
import { Icon } from '../Icon';

interface StatusMessageProps {
  status: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  autoClear?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  tabIndex?: number;
  clearDependencies?: unknown[];
}

const CLEAR_DELAY = 3000;
const STATUS_CLASSES = {
  success: 'text-success-800 bg-success-100',
  error: 'text-error-800 bg-error-100',
  warning: 'text-gray-800 bg-warning-200',
  info: 'text-secondary-800 bg-secondary-100',
};
const BUTTON_CLASSES = {
  success: 'text-success-100 bg-success-800 hover:bg-success-600',
  error: 'text-error-100 bg-error-800 hover:bg-error-600',
  warning: 'text-warning-100 bg-warning-800 hover:bg-warning-600',
  info: 'text-secondary-100 bg-secondary-800 hover:bg-secondary-600',
};

export const StatusMessage = ({
  status,
  children,
  autoClear = false,
  hideCloseButton = false,
  className,
  tabIndex,
  clearDependencies = [],
}: StatusMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    if (!autoClear) {
      return;
    }
    const timeout = setTimeout(() => setIsVisible(false), CLEAR_DELAY);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClear, children, status, ...clearDependencies]);

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
            'flex gap-2 rounded-xl px-4 py-2 text-sm',
            { 'pr-2': !hideCloseButton },
            STATUS_CLASSES[status],
            className,
          )}
          tabIndex={tabIndex}
        >
          <div className="flex-1">{children}</div>
          {!hideCloseButton && (
            <RoundButton
              onClick={() => setIsVisible(false)}
              touchablePadding={4}
              className={cn('h-5 w-5', BUTTON_CLASSES[status])}
            >
              <Icon name="close" className="size-3" />
            </RoundButton>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
