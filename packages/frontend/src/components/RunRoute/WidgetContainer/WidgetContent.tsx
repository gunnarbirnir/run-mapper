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
            'absolute top-0 left-0 z-10 flex w-full items-center gap-3 overflow-hidden rounded-lg bg-white p-3 pr-4',
            {
              'hover:bg-gray-100': isClickable,
            },
          )}
        >
          <div className="bg-primary-200 flex size-8 shrink-0 items-center justify-center rounded-full">
            <Icon
              name={icon}
              className={cn('size-6 text-gray-800', iconClassName)}
            />
          </div>
          <div className="flex h-full flex-col justify-start">
            <Text
              className={cn(
                'text-xs whitespace-nowrap text-gray-500 uppercase',
                {
                  'select-none': isClickable,
                },
              )}
            >
              {label}
            </Text>
            <Text
              className={cn('text-l font-bold whitespace-nowrap', {
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
