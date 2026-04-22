import { useHotkey } from '@tanstack/react-hotkeys';
import { motion } from 'framer-motion';
import { type ReactNode, useEffect, useState } from 'react';

import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

import { RoundButton } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface SidePanelContentProps {
  title?: string;
  children?: ReactNode;
  hideCloseButton?: boolean;
  animateCloseButton?: boolean;
  onClose?: () => void;
}

export const PANEL_WIDTH = '17.5rem';
export const SLIDE_IN_DURATION = 0.15;

export const SidePanelContent = ({
  title,
  children,
  hideCloseButton = false,
  animateCloseButton = true,
  ...props
}: SidePanelContentProps) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const onClose = hideCloseButton ? undefined : props.onClose;

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
              }}
            >
              <RoundButton onClick={onClose}>
                <Icon name="close" className="size-5.5" />
              </RoundButton>
            </motion.div>
          )}
        </div>
      )}
      {children}
    </>
  );
};
