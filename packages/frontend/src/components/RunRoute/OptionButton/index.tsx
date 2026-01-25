import { useEffect, useRef, useState } from 'react';

import { Icon, RoundButton, type IconName } from '~/primitives';
import { spacingPx } from '~/utils';

interface OptionButtonProps {
  index: number;
  icon: IconName;
  disabled?: boolean;
  runRouteSize: { width: number; height: number };
  onClick: () => void;
}

export const OptionButton = ({
  index,
  icon,
  disabled = false,
  runRouteSize,
  onClick,
}: OptionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState<number>(0);

  const hasCalculatedSize = buttonSize > 0;
  const baseSpacing = spacingPx(4);
  const right = baseSpacing + index * (buttonSize + baseSpacing);
  const left = runRouteSize.width - right - buttonSize;
  const bottom = runRouteSize.height - buttonSize - baseSpacing;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setButtonSize(buttonRef.current ? buttonRef.current.offsetWidth : 0);
  }, []);

  return (
    <div
      ref={buttonRef}
      className="absolute"
      style={
        hasCalculatedSize
          ? { top: baseSpacing, right, left, bottom }
          : { visibility: 'hidden' }
      }
    >
      <RoundButton
        onClick={onClick}
        color="white"
        disabled={disabled}
        // +10 so buttons are above widgets
        style={{ zIndex: index + 10 }}
        className="pointer-events-auto h-10 w-10 shadow-md/20"
      >
        <Icon name={icon} className="size-7" />
      </RoundButton>
    </div>
  );
};
