import { useState, useCallback, useLayoutEffect } from 'react';

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
  const [showPanel, setShowPanel] = useState(false);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentItemsState, setCurrentItemsState] = useState<T[]>(
    existingItems ?? [],
  );

  const currentItems = props.currentItems ?? currentItemsState;
  const setCurrentItems = props.setCurrentItems ?? setCurrentItemsState;

  useLayoutEffect(() => {
    if (!parentPanelVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPanel(false);
    }
  }, [parentPanelVisible]);

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
    [currentItems, setCurrentItems],
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
    [currentItems, setCurrentItems],
  );

  const onDeleteItem = useCallback(
    (deleteId: string) => {
      setCurrentItems(currentItems.filter((item) => item.id !== deleteId));
      setShowPanel(false);
    },
    [currentItems, setCurrentItems],
  );

  return {
    showPanel,
    hasMadeChanges,
    editId,
    currentItems,
    setShowPanel,
    setEditId,
    setCurrentItems,
    onClose,
    onHasMadeChanges: setHasMadeChanges,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
  };
};

export type PanelState<T extends { id: string }> = ReturnType<
  typeof usePanelState<T>
>;
