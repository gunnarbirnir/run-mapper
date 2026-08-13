import { AnimatePresence } from 'motion/react';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useCallback } from 'react';

import { Icon, RoundButton, Button, Tooltip } from '~/primitives';
import type { CoordinatesWithId } from '~/types';

import type { MapState } from '../hooks/useMapState';
import type { ActiveRouteState } from '../hooks/useActiveRoute';
import { useRouteUndoRedo } from '../hooks/useRouteUndoRedo';
import { ToolbarContainer } from './ToolbarContainer';

interface RouteCoordinatesToolbarProps {
  isEditingRouteCoordinates: boolean;
  selectedRoutePoint: string | null;
  activeRouteControlPoints: CoordinatesWithId[];
  setActiveRouteControlPoints: ActiveRouteState['setActiveRouteControlPoints'];
  editRouteActionsRef: MapState['editRouteActionsRef'];
}

export const RouteCoordinatesToolbar = ({
  isEditingRouteCoordinates,
  selectedRoutePoint,
  activeRouteControlPoints,
  setActiveRouteControlPoints,
  editRouteActionsRef,
}: RouteCoordinatesToolbarProps) => {
  const isVisible = isEditingRouteCoordinates && selectedRoutePoint === null;

  const { handleUndo, handleRedo, isUndoDisabled, isRedoDisabled } =
    useRouteUndoRedo({
      initialize: isEditingRouteCoordinates,
      activeRouteControlPoints,
      setActiveRouteControlPoints,
    });

  const onSave = useCallback(() => {
    editRouteActionsRef.current.onSave();
  }, [editRouteActionsRef]);

  const onCancel = useCallback(() => {
    editRouteActionsRef.current.onCancel();
  }, [editRouteActionsRef]);

  const onClear = useCallback(() => {
    setActiveRouteControlPoints([]);
  }, [setActiveRouteControlPoints]);

  useHotkey('Enter', onSave, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });
  useHotkey('Escape', onCancel, {
    conflictBehavior: 'replace',
    enabled: isVisible,
  });
  useHotkey(
    {
      key: 'Mod+Z',
    },
    handleUndo,
    {
      conflictBehavior: 'replace',
      enabled: isVisible && !isUndoDisabled,
    },
  );
  useHotkey(
    {
      key: 'Mod+Shift+Z',
    },
    handleRedo,
    {
      conflictBehavior: 'replace',
      enabled: isVisible && !isRedoDisabled,
    },
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <Tooltip.Provider>
          <ToolbarContainer className="flex items-center gap-3 p-1.5">
            <div className="flex items-center gap-2">
              <Tooltip label="Undo">
                <RoundButton
                  color="gray"
                  disabled={isUndoDisabled}
                  onClick={handleUndo}
                >
                  <Icon name="undo" className="size-5" />
                </RoundButton>
              </Tooltip>
              <Tooltip label="Redo">
                <RoundButton
                  color="gray"
                  disabled={isRedoDisabled}
                  onClick={handleRedo}
                >
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
