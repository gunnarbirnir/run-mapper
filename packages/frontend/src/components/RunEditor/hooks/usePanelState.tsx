import { useState, useCallback, useLayoutEffect, useEffect } from 'react';

import { SLIDE_IN_DURATION } from '~/primitives/SidePanel';

interface UsePanelStateProps<T> {
  existingItems?: T[];
  currentItems?: T[];
  parentPanelVisible?: boolean;
  setCurrentItems?: (updatedItems: T[]) => void;
}

export const usePanelState = <T extends { id: string }>({
  existingItems,
  parentPanelVisible,
  ...props
}: UsePanelStateProps<T> = {}) => {
  const [showPanel, setShowPanelState] = useState(false);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentItemsState, setCurrentItemsState] = useState<T[]>(
    existingItems ?? [],
  );
  const [isAnimatingPanel, setIsAnimatingPanel] = useState(false);

  const currentItems = props.currentItems ?? currentItemsState;
  const setCurrentItems = props.setCurrentItems ?? setCurrentItemsState;

  const setShowPanel = useCallback((show: boolean) => {
    setShowPanelState((prev) => {
      if (prev !== show) {
        setIsAnimatingPanel(true);
        return show;
      }
      return prev;
    });
  }, []);

  useLayoutEffect(() => {
    if (!parentPanelVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPanel(false);
    }
  }, [parentPanelVisible, setShowPanel]);

  // For when panel doesn't actually animate
  useEffect(() => {
    if (!isAnimatingPanel) {
      return;
    }
    const timeout = setTimeout(() => {
      setIsAnimatingPanel(false);
    }, SLIDE_IN_DURATION * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isAnimatingPanel, setIsAnimatingPanel]);

  useEffect(() => {
    if (!showPanel && !isAnimatingPanel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditId(null);
    }
  }, [showPanel, isAnimatingPanel]);

  const onClose = useCallback(() => {
    setShowPanel(false);
  }, [setShowPanel]);

  const onAddItem = useCallback(
    (item: Omit<T, 'id'> & { id?: string }) => {
      setCurrentItems([
        ...currentItems,
        { id: `new-item-${Date.now()}`, ...item } as T,
      ]);
      setShowPanel(false);
    },
    [currentItems, setCurrentItems, setShowPanel],
  );

  const onUpdateItem = useCallback(
    (updateId: string, update: Partial<T>) => {
      setCurrentItems(
        currentItems.map((currentItem) =>
          currentItem.id === updateId
            ? { ...currentItem, ...update }
            : currentItem,
        ),
      );
      setShowPanel(false);
    },
    [currentItems, setCurrentItems, setShowPanel],
  );

  const onDeleteItem = useCallback(
    (deleteId: string) => {
      setCurrentItems(currentItems.filter((item) => item.id !== deleteId));
      setShowPanel(false);
    },
    [currentItems, setCurrentItems, setShowPanel],
  );

  const onAnimationComplete = useCallback(() => {
    setIsAnimatingPanel(false);
  }, [setIsAnimatingPanel]);

  return {
    showPanel,
    hasMadeChanges,
    editId,
    currentItems,
    isAnimatingPanel,
    setShowPanel,
    setEditId,
    setCurrentItems,
    onClose,
    onHasMadeChanges: setHasMadeChanges,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onAnimationComplete,
  };
};

export type PanelState<T extends { id: string }> = ReturnType<
  typeof usePanelState<T>
>;
