import { useEffect, useRef, useState } from 'react';

import { Icon, RoundButton, Tooltip } from '~/primitives';
import { cn, spacingPx } from '~/utils';

import type { MapActionButtonProps } from './index';

type ActionButtonProps = Omit<
  MapActionButtonProps,
  'index' | 'children' | 'tabIndex'
>;

interface PlusMinusButtonProps {
  index: number;
  tabIndex?: number;
  plus: ActionButtonProps;
  minus: ActionButtonProps;
}

export const PlusMinusButton = ({
  index,
  tabIndex,
  plus,
  minus,
}: PlusMinusButtonProps) => {
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
      className="transition-scale absolute flex rounded-md shadow-sm duration-100 active:scale-95"
      style={{ zIndex: 10 + index, left, bottom: baseSpacing }}
    >
      <Tooltip label={plus.tooltipLabel}>
        <RoundButton
          onClick={plus.onClick}
          color="white"
          disabled={plus.disabled}
          className={cn(
            'pointer-events-auto rounded-l-md rounded-r-none active:scale-100',
            plus.buttonClassName,
          )}
          style={{ width: buttonSize, height: buttonSize }}
          tabIndex={tabIndex}
        >
          <Icon name="plus" className="size-4.5" />
        </RoundButton>
      </Tooltip>
      <Tooltip label={minus.tooltipLabel}>
        <RoundButton
          onClick={minus.onClick}
          color="white"
          disabled={minus.disabled}
          className={cn(
            'pointer-events-auto rounded-l-none rounded-r-md active:scale-100',
            minus.buttonClassName,
          )}
          style={{ width: buttonSize, height: buttonSize }}
          tabIndex={tabIndex}
        >
          <Icon name="minus" className="size-4.5" />
        </RoundButton>
      </Tooltip>
      <div className="top-10% absolute left-1/2 h-full w-px -translate-x-1/2 bg-gray-200" />
    </div>
  );
};
