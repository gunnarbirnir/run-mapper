import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { RoundButton } from '~/primitives';
import { spacingPx } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';

interface OptionButtonProps {
  index: number;
  disabled?: boolean;
  openDrawerSize: number | null;
  children: ReactNode;
  onClick: () => void;
}

export const OptionButton = ({
  index,
  disabled = false,
  openDrawerSize,
  children,
  onClick,
}: OptionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const hasCalculatedSize = buttonSize > 0;
  const baseSpacing = spacingPx(4);
  const right = openDrawerSize
    ? openDrawerSize + baseSpacing
    : baseSpacing + index * (buttonSize + baseSpacing);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setButtonSize(buttonRef.current ? buttonRef.current.offsetWidth : 0);
  }, []);

  useEffect(() => {
    if (hasCalculatedSize && !isInitialized) {
      // Finish animation before displaying
      const initTimeout = setTimeout(() => {
        setIsInitialized(true);
      }, DRAWER_ANIMATION_DURATION * 1000);

      return () => clearTimeout(initTimeout);
    }
  }, [hasCalculatedSize, isInitialized]);

  return (
    <motion.div
      ref={buttonRef}
      className="absolute"
      style={
        isInitialized
          ? // 20 to be above widgets, -index for correct stacking
            { top: baseSpacing, zIndex: 20 - index }
          : { visibility: 'hidden' }
      }
      animate={{ right }}
      transition={{
        duration: DRAWER_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
    >
      <RoundButton
        onClick={onClick}
        color="white"
        disabled={disabled}
        className="pointer-events-auto h-10 w-10 shadow-md/20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DRAWER_ANIMATION_DURATION }}
        >
          {children}
        </motion.div>
      </RoundButton>
    </motion.div>
  );
};
