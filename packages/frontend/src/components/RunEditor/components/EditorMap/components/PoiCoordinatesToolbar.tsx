import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { Icon, RoundButton, Text, Tooltip } from '~/primitives';

import { ToolbarContainer } from './ToolbarContainer';

interface PoiCoordinatesToolbarProps {
  isVisible: boolean;
  disableHotkeys?: boolean;
  onClose: () => void;
}

export const PoiCoordinatesToolbar = ({
  isVisible,
  disableHotkeys = false,
  onClose,
}: PoiCoordinatesToolbarProps) => {
  useHotkey('Escape', onClose, {
    conflictBehavior: 'allow',
    enabled: isVisible && !disableHotkeys,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <ToolbarContainer className="flex items-center gap-3 p-1.5">
          <Text className="pl-2 text-center text-sm" variant="subtle">
            Editing coordinates
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
