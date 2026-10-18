import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Text, RoundButton, Icon, Tooltip } from '~/primitives';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { cn } from '~/utils';

interface ItemsSectionProps {
  title: string;
  emptyText: string;
  showEmptyText?: boolean;
  buttonLabel?: string;
  children?: ReactNode;
  className?: string;
  emptyTextClassName?: string;
  onAddClick?: () => void;
}

export const ItemsSection = ({
  title,
  buttonLabel,
  emptyText,
  showEmptyText,
  children,
  className,
  emptyTextClassName,
  onAddClick,
}: ItemsSectionProps) => {
  const hasItems = Boolean(children);

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <Text element="h3">{title}</Text>
        {onAddClick && buttonLabel && (
          <Tooltip label={buttonLabel}>
            <RoundButton
              className="size-6"
              onClick={onAddClick}
              touchablePadding={8}
            >
              <Icon name="plus" className="size-4" />
            </RoundButton>
          </Tooltip>
        )}
      </div>
      <AnimatePresence>
        {(!hasItems || showEmptyText) && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{
              duration: DEFAULT_FADE_IN_DURATION,
              delay: DEFAULT_FADE_IN_DURATION,
              ease: DEFAULT_EASING,
            }}
          >
            <Text
              variant="subtle"
              className={cn('mt-3 text-sm text-pretty', emptyTextClassName)}
            >
              {emptyText}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
      {hasItems && <div className="mt-5">{children}</div>}
    </section>
  );
};
