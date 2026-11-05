import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { Icon, RoundButton, Text, Tooltip } from '~/primitives';

import { ToolbarContainer } from './ToolbarContainer';

interface ViewMapToolbarProps {
  isVisible: boolean;
  disableHotkeys?: boolean;
  onClose: () => void;
}

export const ViewMapToolbar = ({
  isVisible,
  disableHotkeys = false,
  onClose,
}: ViewMapToolbarProps) => {
  useHotkey('Escape', onClose, {
    conflictBehavior: 'allow',
    enabled: isVisible && !disableHotkeys,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <ToolbarContainer className="flex items-center gap-3 p-1.5">
          <Text className="pl-2 text-center text-sm" variant="subtle">
            Viewing map
          </Text>
          <Tooltip label="Close">
            <RoundButton onClick={onClose}>
              <Icon name="close" className="size-5.5" />
            </RoundButton>
          </Tooltip>
        </ToolbarContainer>
      )}
    </AnimatePresence>
  );
};
