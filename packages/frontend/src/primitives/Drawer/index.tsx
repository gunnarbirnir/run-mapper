import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  width?: number;
  className?: string;
}

export const Drawer = ({
  isOpen,
  children,
  width = 200,
  className,
}: DrawerProps) => {
  return (
    <motion.aside
      className={cn(
        'absolute top-0 bottom-0 bg-gray-50',
        { 'drop-shadow-md/20': isOpen },
        className,
      )}
      style={{ width }}
      animate={{ right: isOpen ? 0 : -width }}
      transition={{ duration: DRAWER_ANIMATION_DURATION, ease: DEFAULT_EASING }}
    >
      {children}
    </motion.aside>
  );
};
