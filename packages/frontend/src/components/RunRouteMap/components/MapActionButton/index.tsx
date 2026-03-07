import { useEffect, useRef, useState, type ReactNode } from 'react';

import { RoundButton } from '~/primitives';
import { cn, spacingPx } from '~/utils';

interface MapActionButtonProps {
  index: number;
  disabled?: boolean;
  children: ReactNode;
  buttonClassName?: string;
  onClick: () => void;
}

export const MapActionButton = ({
  index,
  disabled = false,
  children,
  buttonClassName,
  onClick,
}: MapActionButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonSize = spacingPx(8);
  const betweenSpacing = spacingPx(3);
  const outsideSpacing = spacingPx(4);
  const left = outsideSpacing + index * (buttonSize + betweenSpacing);

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
      style={{ zIndex: 10 + index, left, bottom: outsideSpacing }}
    >
      <RoundButton
        onClick={onClick}
        color="white"
        disabled={disabled}
        className={cn(
          'pointer-events-auto rounded-md shadow-sm',
          buttonClassName,
        )}
        style={{ width: buttonSize, height: buttonSize }}
      >
        <>{children}</>
      </RoundButton>
    </div>
  );
};
