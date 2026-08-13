import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useCallback } from 'react';

import { Icon, RoundButton, Text, Tooltip } from '~/primitives';

import { ToolbarContainer } from './ToolbarContainer';
import { ActiveRouteState } from '../hooks/useActiveRoute';

interface SelectedRoutePointToolbarProps {
  selectedRoutePoint: string | null;
  setSelectedRoutePoint: ActiveRouteState['setSelectedRoutePoint'];
  setActiveRouteControlPoints: ActiveRouteState['setActiveRouteControlPoints'];
}

export const SelectedRoutePointToolbar = ({
  selectedRoutePoint,
  setSelectedRoutePoint,
  setActiveRouteControlPoints,
}: SelectedRoutePointToolbarProps) => {
  const isVisible = selectedRoutePoint !== null;

  const onClose = useCallback(() => {
    setSelectedRoutePoint(null);
  }, [setSelectedRoutePoint]);

  const onDelete = useCallback(() => {
    setSelectedRoutePoint(null);
    setActiveRouteControlPoints((prev) =>
      prev.filter((coordinate) => coordinate.id !== selectedRoutePoint),
    );
  }, [selectedRoutePoint, setSelectedRoutePoint, setActiveRouteControlPoints]);

  useHotkey('Backspace', onDelete, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });
  useHotkey('Escape', onClose, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <ToolbarContainer className="flex items-center gap-3 p-1.5">
          <Text className="pl-2 text-center text-sm" variant="subtle">
            Editing route point
          </Text>
          <Tooltip.Provider>
            <div className="flex items-center gap-2">
              <Tooltip label="Delete">
                <RoundButton onClick={onDelete} color="error">
                  <Icon name="trash" className="size-4.5" />
                </RoundButton>
              </Tooltip>
              <Tooltip label="Close">
                <RoundButton onClick={onClose}>
                  <Icon name="close" className="size-5.5" />
                </RoundButton>
              </Tooltip>
            </div>
          </Tooltip.Provider>
        </ToolbarContainer>
      )}
    </AnimatePresence>
  );
};
