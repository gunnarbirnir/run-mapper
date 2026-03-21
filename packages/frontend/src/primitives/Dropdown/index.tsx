import type { CSSProperties } from 'react';
import { Select } from '@base-ui/react/select';

import { cn, spacingPx } from '~/utils';

interface DropdownProps {
  items: { label: string; value: string }[];
  value?: string;
  className?: string;
  popupClassName?: string;
  style?: CSSProperties;
  tabIndex?: number;
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
  tabIndex,
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
        tabIndex={tabIndex}
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
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="size-4"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.884 16.116a1.25 1.25 0 0 1 0 1.768l-3.94 3.939a2.75 2.75 0 0 1-3.889 0l-3.939-3.94a1.25 1.25 0 0 1 1.768-1.767l3.94 3.94a.25.25 0 0 0 .353 0l3.94-3.94a1.25 1.25 0 0 1 1.767 0ZM6.116 7.884a1.25 1.25 0 0 1 0-1.768l3.94-3.94a2.75 2.75 0 0 1 3.889 0l3.939 3.94a1.25 1.25 0 0 1-1.768 1.768l-3.94-3.94a.25.25 0 0 0-.353 0l-3.94 3.94a1.25 1.25 0 0 1-1.767 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="size-3.5"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M21.428 5.322a1.313 1.313 0 0 1 0 1.856l-10.44 10.44a2.812 2.812 0 0 1-3.977 0l-4.44-4.44a1.313 1.313 0 0 1 1.857-1.856l4.44 4.44a.188.188 0 0 0 .265 0l10.439-10.44a1.313 1.313 0 0 1 1.856 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
