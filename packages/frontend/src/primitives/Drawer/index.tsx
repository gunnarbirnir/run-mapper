import { type ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { Text } from '../Text';
import { RoundButton } from '../Button';
import { Icon } from '../Icon';

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  title?: string;
  width?: number;
  minWidth?: number;
  disablePadding?: boolean;
  className?: string;
  titleSectionClassName?: string;
  onClose?: () => void;
}

export const Drawer = ({
  isOpen,
  children,
  title,
  width = 200,
  minWidth = 0,
  disablePadding = false,
  className,
  titleSectionClassName,
  onClose,
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
        { 'shadow-md/20': isOpen },
        { 'px-4 pt-5 pb-6': !disablePadding },
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
      {(title || onClose) && (
        <div className="flex items-center justify-between">
          <Text element="h2" className={cn('mb-4', titleSectionClassName)}>
            {title}
          </Text>
          {onClose && (
            <RoundButton onClick={onClose}>
              <Icon name="close" className="size-6" />
            </RoundButton>
          )}
        </div>
      )}
      {children}
    </motion.aside>
  );
};
