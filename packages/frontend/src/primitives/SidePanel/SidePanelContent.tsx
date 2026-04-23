import { useHotkey } from '@tanstack/react-hotkeys';
import { motion } from 'framer-motion';
import { memo, type ReactNode, useEffect, useState } from 'react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

import { RoundButton } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { useSidePanelItemContext } from './SidePanelItemContext';
import { SLIDE_IN_DURATION } from './SidePanelItem';

export interface SidePanelContentProps {
  title?: string;
  children?: ReactNode;
  animateCloseButton?: boolean;
  onClose?: () => void;
}

export const SidePanelContent = memo(function SidePanelContent({
  title,
  children,
  animateCloseButton = true,
  ...props
}: SidePanelContentProps) {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { isTopVisibleItem, isAnyAnimating } = useSidePanelItemContext();
  const onClose = isTopVisibleItem ? props.onClose : undefined;

  useEffect(() => {
    if (isFirstRender) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  useHotkey(
    'Escape',
    () => {
      if (onClose) {
        onClose();
      }
    },
    { conflictBehavior: 'allow' },
  );

  return (
    <>
      {Boolean(title || onClose) && (
        <div className="mb-4 flex h-8 items-start justify-between gap-2">
          {title ? (
            <Text element="h2" className="truncate">
              {title}
            </Text>
          ) : (
            <div />
          )}
          {onClose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration:
                  animateCloseButton && !isFirstRender
                    ? DEFAULT_FADE_IN_DURATION
                    : 0,
                ease: DEFAULT_EASING,
                delay: !isFirstRender ? SLIDE_IN_DURATION : 0,
              }}
            >
              <RoundButton onClick={onClose} disabled={isAnyAnimating}>
                <Icon name="close" className="size-5.5" />
              </RoundButton>
            </motion.div>
          )}
        </div>
      )}
      {children}
    </>
  );
});
