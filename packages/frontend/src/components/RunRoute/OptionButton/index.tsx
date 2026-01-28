import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { Icon, RoundButton, type IconName } from '~/primitives';
import { spacingPx } from '~/utils';
import { DEFAULT_EASING, DRAWER_ANIMATION_DURATION } from '~/constants';

interface OptionButtonProps {
  index: number;
  icon: IconName;
  disabled?: boolean;
  openDrawerSize: number | null;
  secondaryIcon?: IconName;
  secondaryIconActive?: boolean;
  onClick: () => void;
}

export const OptionButton = ({
  index,
  icon,
  disabled = false,
  openDrawerSize,
  secondaryIcon,
  secondaryIconActive,
  onClick,
}: OptionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState<number>(0);

  const hasCalculatedSize = buttonSize > 0;
  const baseSpacing = spacingPx(4);
  const right = openDrawerSize
    ? openDrawerSize + baseSpacing
    : baseSpacing + index * (buttonSize + baseSpacing);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setButtonSize(buttonRef.current ? buttonRef.current.offsetWidth : 0);
  }, []);

  return (
    <motion.div
      ref={buttonRef}
      className="absolute"
      style={
        hasCalculatedSize
          ? // 20 to be above widgets, -index for correct stacking
            { top: baseSpacing, zIndex: 20 - index }
          : { visibility: 'hidden' }
      }
      animate={{ right }}
      initial={false}
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
        {secondaryIcon && secondaryIconActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DRAWER_ANIMATION_DURATION }}
          >
            <Icon name={secondaryIcon} className="size-6" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DRAWER_ANIMATION_DURATION }}
          >
            <Icon name={icon} className="size-7" />
          </motion.div>
        )}
      </RoundButton>
    </motion.div>
  );
};
