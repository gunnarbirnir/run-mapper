import { motion } from 'motion/react';
import { type ReactNode, forwardRef } from 'react';

import {
  DEFAULT_EASING,
  DEFAULT_FADE_IN_DURATION,
  WIDGET_ANIMATION_DURATION,
} from '~/constants';
import { Text } from '~/primitives';
import { cn, spacingPx } from '~/utils';

interface WidgetContentProps {
  label?: string;
  text?: string;
  customContent?: ReactNode;
  isActive: boolean;
  isOpen: boolean;
  isExpanded: boolean;
  isClickable: boolean;
  hasScrolled: boolean;
}

const SCALE_TITLE = 1.3;

export const WidgetContent = forwardRef<HTMLDivElement, WidgetContentProps>(
  function WidgetContent(
    {
      customContent = null,
      label,
      text,
      isActive,
      isOpen,
      isExpanded,
      isClickable,
      hasScrolled,
    },
    ref,
  ) {
    if (label && text) {
      return (
        <div
          ref={ref}
          className={cn(
            'absolute top-0 right-0 left-0 z-10 flex flex-col gap-1 overflow-hidden rounded-t-lg bg-white p-4 text-center',
            {
              'pb-6': isExpanded,
              'rounded-b-lg': !isExpanded,
              'shadow-md': hasScrolled && isExpanded,
              'hover:bg-gray-200': isClickable,
            },
          )}
        >
          <motion.div
            animate={
              isActive
                ? { scale: SCALE_TITLE, translateY: spacingPx(2) }
                : { scale: 1, translateY: 0 }
            }
            transition={{
              duration: WIDGET_ANIMATION_DURATION,
              ease: DEFAULT_EASING,
            }}
          >
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
          </motion.div>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: DEFAULT_FADE_IN_DURATION,
                ease: DEFAULT_EASING,
              }}
            >
              <Text
                className={cn('text-xl font-bold whitespace-nowrap', {
                  'select-none': isClickable,
                })}
              >
                {text}
              </Text>
            </motion.div>
          )}
        </div>
      );
    }

    return customContent;
  },
);
