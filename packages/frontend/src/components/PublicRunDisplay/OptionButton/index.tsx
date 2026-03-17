import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { RoundButton, Tooltip } from '~/primitives';
import { spacingPx, cn } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';

interface OptionButtonProps {
  index: number;
  disabled?: boolean;
  tooltipLabel?: string;
  buttonSize: number;
  openDrawerSize: number | null;
  children: ReactNode;
  buttonClassName?: string;
  onClick: () => void;
}

export const OptionButton = ({
  index,
  disabled = false,
  tooltipLabel,
  buttonSize,
  openDrawerSize,
  children,
  buttonClassName,
  onClick,
}: OptionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isSmallScreen } = useMediaQuery();

  const baseSpacing = spacingPx(3);
  const mainAxisInset = baseSpacing + index * (buttonSize + baseSpacing);
  const top = isSmallScreen
    ? // To be below the route dropdown
      mainAxisInset + buttonSize + baseSpacing
    : baseSpacing;
  const right = isSmallScreen
    ? baseSpacing
    : openDrawerSize
      ? openDrawerSize + baseSpacing
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
      <Tooltip label={tooltipLabel ?? ''} disabled={tooltipLabel === undefined}>
        <RoundButton
          onClick={onClick}
          color="white"
          disabled={disabled}
          className={cn(
            'pointer-events-auto',
            {
              'shadow-md/20': !openDrawerSize || index === 0,
            },
            buttonClassName,
          )}
          style={{ width: buttonSize, height: buttonSize }}
        >
          <>{children}</>
        </RoundButton>
      </Tooltip>
    </motion.div>
  );
};
