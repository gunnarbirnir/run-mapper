import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button, Text, RoundButton, Icon, Tooltip } from '~/primitives';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';
import { cn } from '~/utils';

interface ItemsSectionProps {
  title: string;
  emptyText: string;
  showEmptyText?: boolean;
  buttonLabel?: string;
  children?: ReactNode;
  className?: string;
  onAddClick?: () => void;
}

export const ItemsSection = ({
  title,
  buttonLabel,
  emptyText,
  showEmptyText,
  children,
  className,
  onAddClick,
}: ItemsSectionProps) => {
  const hasItems = Boolean(children);
  const hasSmallAddButton = hasItems && onAddClick && buttonLabel;

  return (
    <section className={className}>
      <div
        className={cn('flex items-center justify-between', {
          'pb-1': hasSmallAddButton,
        })}
      >
        <Text element="h3">{title}</Text>
        {hasSmallAddButton && (
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
            <Text variant="subtle" className="mt-2 text-sm">
              {emptyText}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
      {hasItems && <div className="mt-4">{children}</div>}
      {!hasItems && onAddClick && buttonLabel && (
        <Button className="mt-5 w-full" onClick={onAddClick}>
          {buttonLabel}
        </Button>
      )}
    </section>
  );
};
