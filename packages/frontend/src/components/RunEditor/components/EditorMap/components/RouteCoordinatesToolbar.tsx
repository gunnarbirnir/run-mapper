import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { Icon, RoundButton, Button, Tooltip } from '~/primitives';

import { ToolbarContainer } from './ToolbarContainer';

interface RouteCoordinatesToolbarProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RouteCoordinatesToolbar = ({
  isVisible,
  onClose,
}: RouteCoordinatesToolbarProps) => {
  useHotkey('Escape', onClose, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <Tooltip.Provider>
          <ToolbarContainer className="flex items-center gap-3 p-1.5">
            <div className="flex items-center gap-2">
              <Tooltip label="Undo">
                <RoundButton color="gray">
                  <Icon name="undo" className="size-5" />
                </RoundButton>
              </Tooltip>
              <Tooltip label="Redo">
                <RoundButton color="gray" disabled>
                  <Icon name="undo" className="size-5 rotate-y-180" />
                </RoundButton>
              </Tooltip>
              <Button color="gray" size="small">
                Clear
              </Button>
            </div>
            <Tooltip label="Close">
              <RoundButton onClick={onClose}>
                <Icon name="close" className="size-5.5" />
              </RoundButton>
            </Tooltip>
          </ToolbarContainer>
        </Tooltip.Provider>
      )}
    </AnimatePresence>
  );
};
