import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { RoundButton } from '~/primitives';
import { spacingPx, cn } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';

interface OptionButtonProps {
  index: number;
  disabled?: boolean;
  openDrawerSize: number | null;
  children: ReactNode;
  buttonClassName?: string;
  onClick: () => void;
}

export const OptionButton = ({
  index,
  disabled = false,
  openDrawerSize,
  children,
  buttonClassName,
  onClick,
}: OptionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isSmallScreen } = useMediaQuery();

  const buttonSize = spacingPx(10);
  const outsideSpacing = spacingPx(4);
  const betweenSpacing = spacingPx(3);
  const mainAxisInset = outsideSpacing + index * (buttonSize + betweenSpacing);
  const top = openDrawerSize
    ? outsideSpacing
    : isSmallScreen
      ? mainAxisInset
      : outsideSpacing;
  const right = openDrawerSize
    ? openDrawerSize + outsideSpacing
    : isSmallScreen
      ? outsideSpacing
      : mainAxisInset;

  useEffect(() => {
    if (!isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return (
    <motion.div
      ref={buttonRef}
      className="absolute"
      style={
        // 20 to be above widgets, -index for correct stacking
        { zIndex: 20 - index }
      }
      animate={{ right, top }}
      transition={{
        duration: isInitialized ? DRAWER_ANIMATION_DURATION : 0,
        ease: DEFAULT_EASING,
      }}
    >
      <RoundButton
        onClick={onClick}
        color="white"
        disabled={disabled}
        className={cn(
          'pointer-events-auto',
          { 'shadow-md/20': !openDrawerSize || index === 0 },
          buttonClassName,
        )}
        style={{ width: buttonSize, height: buttonSize }}
      >
        <>{children}</>
      </RoundButton>
    </motion.div>
  );
};
