import { type ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHotkey } from '@tanstack/react-hotkeys';

import { cn, convertRemToPixels } from '~/utils';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

import { Text } from '../Text';
import { RoundButton } from '../Button';
import { Icon } from '../Icon';

export interface SidePanelProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  animateCloseButton?: boolean;
  onClose?: () => void;
}

export const PANEL_WIDTH = '17.5rem';
export const SLIDE_IN_DURATION = 0.15;

export const SidePanel = ({
  title,
  children,
  className,
  animateCloseButton = false,
  onClose,
}: SidePanelProps) => {
  const { isSmallScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const panelWidth = isSmallScreen
    ? windowWidth
    : convertRemToPixels(PANEL_WIDTH);

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
    <aside
      className={cn('h-full bg-white shadow-lg/20', className)}
      style={{ width: panelWidth }}
    >
      {Boolean(title || onClose) && (
        <div className="mb-4 flex h-8 items-start justify-between">
          {title ? <Text element="h2">{title}</Text> : <div />}
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
    </aside>
  );
};
