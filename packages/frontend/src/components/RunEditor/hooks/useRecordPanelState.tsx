import { useState, useCallback } from 'react';

interface UseRecordPanelStateProps<T> {
  existingItems?: Record<string, T[]>;
}

export const useRecordPanelState = <T extends { id: string }>({
  existingItems,
}: UseRecordPanelStateProps<T> = {}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [currentItems, setCurrentItems] = useState<Record<string, T[]>>(
    existingItems ?? {},
  );

  const setItemRecord = useCallback((updateId: string, update: T[]) => {
    setCurrentItems((prevItems) => ({
      ...prevItems,
      [updateId]: update,
    }));
  }, []);

  const onClose = useCallback(() => {
    setShowPanel(false);
  }, [setShowPanel]);

  const onAddItem = useCallback(
    (item: Omit<T, 'id'> & { id?: string }, recordId: string) => {
      setCurrentItems((prevItems) => ({
        ...prevItems,
        [recordId]: [
          ...(prevItems[recordId] || []),
          { id: `new-poi-${Date.now()}`, ...item } as T,
        ],
      }));
      setShowPanel(false);
    },
    [],
  );

  const onUpdateItem = useCallback(
    (updateId: string, update: Partial<T>, recordId: string) => {
      setCurrentItems((prevItems) => ({
        ...prevItems,
        [recordId]: prevItems[recordId].map((prevItem) =>
          prevItem.id === updateId ? { ...prevItem, ...update } : prevItem,
        ),
      }));
      setShowPanel(false);
    },
    [],
  );

  const onDeleteItem = useCallback((deleteId: string, recordId: string) => {
    setCurrentItems((prevItems) => ({
      ...prevItems,
      [recordId]: prevItems[recordId].filter((item) => item.id !== deleteId),
    }));
    setShowPanel(false);
  }, []);

  return {
    showPanel,
    hasMadeChanges,
    editId,
    editRecordId,
    currentItems,
    setShowPanel,
    setEditId,
    setEditRecordId,
    setCurrentItems,
    setItemRecord,
    onClose,
    onHasMadeChanges: setHasMadeChanges,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
  };
};

export type RecordPanelState<T extends { id: string }> = ReturnType<
  typeof useRecordPanelState<T>
>;
