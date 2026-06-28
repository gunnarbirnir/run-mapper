import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useCallback } from 'react';

import { Icon, RoundButton, Button, Tooltip } from '~/primitives';

import type { MapState } from '../hooks/useMapState';
import { ToolbarContainer } from './ToolbarContainer';

interface RouteCoordinatesToolbarProps {
  isVisible: boolean;
  setEditRouteCoordinates: MapState['setEditRouteCoordinates'];
  editRouteActionsRef: MapState['editRouteActionsRef'];
}

export const RouteCoordinatesToolbar = ({
  isVisible,
  setEditRouteCoordinates,
  editRouteActionsRef,
}: RouteCoordinatesToolbarProps) => {
  const onSave = useCallback(() => {
    editRouteActionsRef.current.onSave();
  }, [editRouteActionsRef]);

  const onCancel = useCallback(() => {
    editRouteActionsRef.current.onCancel();
  }, [editRouteActionsRef]);

  const onClear = useCallback(() => {
    setEditRouteCoordinates([]);
  }, [setEditRouteCoordinates]);

  useHotkey('Enter', onSave, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });
  useHotkey('Escape', onCancel, {
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
              <Button color="gray" size="small" onClick={onClear}>
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip label="Save">
                <RoundButton onClick={onSave} color="success">
                  <Icon name="checkmark" className="size-5.5" />
                </RoundButton>
              </Tooltip>
              <Tooltip label="Close">
                <RoundButton onClick={onCancel}>
                  <Icon name="close" className="size-5.5" />
                </RoundButton>
              </Tooltip>
            </div>
          </ToolbarContainer>
        </Tooltip.Provider>
      )}
    </AnimatePresence>
  );
};
