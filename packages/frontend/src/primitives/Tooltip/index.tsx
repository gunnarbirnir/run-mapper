import type { CSSProperties, ReactNode } from 'react';
import { Tooltip as BaseUiTooltip } from '@base-ui/react/tooltip';

import { cn } from '~/utils';

interface TooltipProps {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start';
  sideOffset?: number;
  className?: string;
  triggerClassName?: string;
  style?: CSSProperties;
  triggerStyle?: CSSProperties;
}

const BASE_SIDE_OFFSET = 10;
const ANIMATION_CLASSES =
  'transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-90 data-starting-style:opacity-0';

const Tooltip = ({
  label,
  children,
  disabled = false,
  side,
  sideOffset = 0,
  className,
  triggerClassName,
  style,
  triggerStyle,
}: TooltipProps) => {
  return (
    <BaseUiTooltip.Root>
      <BaseUiTooltip.Trigger
        render={<div />}
        disabled={disabled}
        className={triggerClassName}
        style={triggerStyle}
      >
        {children}
      </BaseUiTooltip.Trigger>
      <BaseUiTooltip.Portal>
        <BaseUiTooltip.Positioner
          sideOffset={sideOffset + BASE_SIDE_OFFSET}
          side={side}
        >
          <BaseUiTooltip.Popup
            className={cn(
              'flex max-w-65 origin-top flex-col rounded-md bg-gray-700 px-2 py-1 text-center text-sm text-white shadow-sm',
              ANIMATION_CLASSES,
              className,
            )}
            style={style}
          >
            <BaseUiTooltip.Arrow className="flex data-[side=bottom]:-top-2 data-[side=bottom]:rotate-0 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180">
              <ArrowSvg />
            </BaseUiTooltip.Arrow>
            {label}
          </BaseUiTooltip.Popup>
        </BaseUiTooltip.Positioner>
      </BaseUiTooltip.Portal>
    </BaseUiTooltip.Root>
  );
};

function ArrowSvg() {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-gray-700"
      />
    </svg>
  );
}

Tooltip.Provider = BaseUiTooltip.Provider;

export { Tooltip };
