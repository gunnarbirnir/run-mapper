import { useEffect, useRef, useState, type ReactNode } from 'react';

import { RoundButton, Tooltip } from '~/primitives';
import { cn, spacingPx } from '~/utils';

interface MapActionButtonProps {
  index: number;
  tooltipLabel: string;
  disabled?: boolean;
  children: ReactNode;
  buttonClassName?: string;
  onClick: () => void;
}

export const MapActionButton = ({
  index,
  tooltipLabel,
  disabled = false,
  children,
  buttonClassName,
  onClick,
}: MapActionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonSize = spacingPx(8);
  const baseSpacing = spacingPx(3);
  const left = baseSpacing + index * (buttonSize + baseSpacing);

  useEffect(() => {
    if (!isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return (
    <div
      ref={buttonRef}
      className="absolute"
      style={{ zIndex: 10 + index, left, bottom: baseSpacing }}
    >
      <Tooltip label={tooltipLabel}>
        <RoundButton
          onClick={onClick}
          color="white"
          disabled={disabled}
          className={cn(
            'pointer-events-auto rounded-md shadow-sm',
            buttonClassName,
          )}
          style={{ width: buttonSize, height: buttonSize }}
          // Should come after drawers
          tabIndex={30 + index}
        >
          <>{children}</>
        </RoundButton>
      </Tooltip>
    </div>
  );
};
