import { type ReactNode, forwardRef } from 'react';

import { type IconName, Icon, Text } from '~/primitives';
import { cn } from '~/utils';

interface WidgetContentProps {
  label?: string;
  text?: string;
  customContent?: ReactNode;
  isClickable: boolean;
  icon: IconName;
  iconClassName?: string;
}

export const WidgetContent = forwardRef<HTMLDivElement, WidgetContentProps>(
  function WidgetContent(
    { customContent = null, label, text, icon, iconClassName, isClickable },
    ref,
  ) {
    if (label && text) {
      return (
        <div
          ref={ref}
          className={cn(
            'absolute top-0 left-0 z-10 flex w-full items-center gap-2 overflow-hidden rounded-lg bg-white p-3 pr-4',
            {
              'hover:bg-gray-100': isClickable,
            },
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
            <Icon
              name={icon}
              className={cn('text-primary-500 size-7', iconClassName)}
            />
          </div>
          <div className="flex h-full flex-col justify-start">
            <Text
              variant="label"
              className={cn('whitespace-nowrap', {
                'select-none': isClickable,
              })}
            >
              {label}
            </Text>
            <Text
              variant="bold"
              className={cn('whitespace-nowrap', {
                'select-none': isClickable,
              })}
            >
              {text}
            </Text>
          </div>
        </div>
      );
    }

    return customContent;
  },
);
