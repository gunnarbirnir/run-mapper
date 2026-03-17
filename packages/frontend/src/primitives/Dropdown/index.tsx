import type { CSSProperties } from 'react';
import { Select } from '@base-ui/react/select';

import { cn, spacingPx } from '~/utils';

interface DropdownProps {
  items: { label: string; value: string }[];
  value?: string;
  className?: string;
  popupClassName?: string;
  style?: CSSProperties;
  onChange?: (value: string | null) => void;
}

const ANIMATION_CLASSES =
  'transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0';
// Not exactly sure what this does
const DATA_SIDE_NONE_CLASSES =
  'data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-1000 data-[side=none]:data-starting-style:transition-none';
const GROUP_DATA_CLASSES =
  'group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4';
const HIGHLIGHTED_CLASSES =
  'data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-secondary-500';
const SCROLL_ARROW_BASE_CLASSES = `z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-gray-100 text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] text-gray-900`;

export const Dropdown = ({
  items,
  value,
  className,
  popupClassName,
  style,
  onChange,
}: DropdownProps) => {
  return (
    <Select.Root items={items} value={value} onValueChange={onChange}>
      <Select.Trigger
        className={cn(
          'flex h-10 min-w-40 cursor-pointer items-center justify-between gap-3 rounded-lg bg-white px-3 text-gray-900 select-none hover:bg-gray-100 data-popup-open:bg-gray-100',
          className,
        )}
        style={style}
      >
        <Select.Value className="truncate data-placeholder:opacity-60" />
        <ChevronUpDownIcon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          className="z-10 outline-none select-none"
          sideOffset={spacingPx(2)}
          collisionPadding={spacingPx(3)}
        >
          <Select.Popup
            className={cn(
              'max-w-200 min-w-40 origin-top rounded-md bg-white bg-clip-padding text-gray-900',
              ANIMATION_CLASSES,
              DATA_SIDE_NONE_CLASSES,
              popupClassName,
            )}
          >
            <Select.ScrollUpArrow
              className={cn(
                'top-0 data-[side=none]:before:-top-full',
                SCROLL_ARROW_BASE_CLASSES,
              )}
            />
            <Select.List className="relative max-h-200 scroll-py-6 overflow-y-auto py-1">
              {items.map(({ label, value }) => (
                <Select.Item
                  key={label}
                  value={value}
                  className={cn(
                    'grid cursor-pointer grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-3 text-sm leading-4 outline-none select-none pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]',
                    GROUP_DATA_CLASSES,
                    HIGHLIGHTED_CLASSES,
                  )}
                >
                  <Select.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">
                    {label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow
              className={cn(
                'bottom-0 data-[side=none]:before:-bottom-full',
                SCROLL_ARROW_BASE_CLASSES,
              )}
            />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

function ChevronUpDownIcon() {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 8 12"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.5"
    >
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="size-3" fill="currentcolor" viewBox="0 0 10 10">
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}
