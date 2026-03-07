import { type ReactNode, forwardRef } from 'react';

import { type IconName, Icon, Text } from '~/primitives';
import { cn } from '~/utils';

interface WidgetContentProps {
  height: number;
  text?: string;
  customContent?: ReactNode;
  isClickable: boolean;
  icon?: IconName;
  iconClassName?: string;
}

export const WidgetContent = forwardRef<HTMLDivElement, WidgetContentProps>(
  function WidgetContent(
    { height, text, icon, iconClassName, isClickable, customContent = null },
    ref,
  ) {
    if (text && icon) {
      return (
        <div
          ref={ref}
          className={cn(
            'absolute top-0 left-0 z-10 flex items-center gap-2 overflow-hidden rounded-xl px-3',
            {
              'hover:bg-gray-100': isClickable,
            },
          )}
          style={{ height }}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full">
            <Icon
              name={icon}
              className={cn('text-primary-500 size-7', iconClassName)}
            />
          </div>
          <Text
            variant="bold"
            className={cn('text-sm whitespace-nowrap', {
              'select-none': isClickable,
            })}
          >
            {text}
          </Text>
        </div>
      );
    }

    return customContent;
  },
);
