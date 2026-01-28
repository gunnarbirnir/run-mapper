import { motion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { spacingPx } from '~/utils';

interface ModalContentProps {
  isOpen: boolean;
  children: ReactNode;
  setHasScrolled: (hasScrolled: boolean) => void;
}

const FADE_IN_DELAY = 0.1;

export const ModalContent = ({
  isOpen,
  children,
  setHasScrolled,
}: ModalContentProps) => {
  useEffect(() => {
    if (isOpen) {
      setHasScrolled(false);
    }
  }, [isOpen, setHasScrolled]);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: spacingPx(3) }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: DEFAULT_FADE_IN_DURATION,
        ease: DEFAULT_EASING,
        delay: FADE_IN_DELAY,
      }}
      className="absolute inset-0 top-14 z-1 overflow-y-auto pt-2 pb-8"
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        setHasScrolled(target.scrollTop > 0);
      }}
    >
      <div>{children}</div>
    </motion.div>
  );
};
