import { useState, useCallback } from 'react';

interface UsePanelStateProps<T> {
  existingItems?: T[];
}

export const usePanelState = <T extends { id: string }>({
  existingItems,
}: UsePanelStateProps<T> = {}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentItems, setCurrentItems] = useState<T[]>(existingItems ?? []);

  const onClose = useCallback(() => {
    setShowPanel(false);
  }, [setShowPanel]);

  const onAddItem = useCallback((item: Omit<T, 'id'>) => {
    setCurrentItems((prevItems) => [
      ...prevItems,
      { ...item, id: `new-poi-${Date.now()}` } as T,
    ]);
    setShowPanel(false);
  }, []);

  const onUpdateItem = useCallback((updateId: string, update: Partial<T>) => {
    setCurrentItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === updateId ? { ...prevItem, ...update } : prevItem,
      ),
    );
    setShowPanel(false);
  }, []);

  const onDeleteItem = useCallback((deleteId: string) => {
    setCurrentItems((prevItems) =>
      prevItems.filter((item) => item.id !== deleteId),
    );
    setShowPanel(false);
    setEditId(null);
  }, []);

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
