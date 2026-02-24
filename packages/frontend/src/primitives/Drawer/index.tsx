import { type ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  width?: number;
  minWidth?: number;
  className?: string;
}

export const Drawer = ({
  isOpen,
  children,
  width = 200,
  minWidth = 0,
  className,
}: DrawerProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isSmallScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const activeWidth = isSmallScreen ? Math.max(windowWidth, minWidth) : width;

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
    }
  }, [isOpen]);

  return (
    <motion.aside
      className={cn(
        'absolute top-0 bottom-0 bg-gray-50',
        { 'drop-shadow-md/20': isOpen },
        className,
      )}
      style={{ width: activeWidth, right: -activeWidth }}
      animate={{ right: isOpen ? 0 : -activeWidth }}
      transition={{
        duration: isOpen || isAnimating ? DRAWER_ANIMATION_DURATION : 0,
        ease: DEFAULT_EASING,
      }}
      onAnimationComplete={() => {
        if (!isOpen) {
          setIsAnimating(false);
        }
      }}
    >
      {children}
    </motion.aside>
  );
};
