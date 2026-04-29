import { useState, useEffect, useCallback } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { useSidePanelItemContext } from '~/primitives';

interface UsePanelFormProps {
  editId: string | null;
  isDefaultValue: boolean;
  onClose: () => void;
  resetForm: () => void;
  submitForm: () => void;
  onHasMadeChanges: (hasChanges: boolean) => void;
  onDeleteItem: (id: string) => void;
}

export const usePanelForm = ({
  editId,
  isDefaultValue,
  onClose,
  resetForm,
  submitForm,
  onHasMadeChanges,
  onDeleteItem,
}: UsePanelFormProps) => {
  const { itemId, isTopVisibleItem } = useSidePanelItemContext();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditing = Boolean(editId);

  const handleCloseSaveDialog = useCallback(() => {
    setSaveDialogOpen(false);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleOnClose = useCallback(() => {
    if (isDefaultValue) {
      onClose();
    } else {
      setSaveDialogOpen(true);
    }
  }, [isDefaultValue, onClose]);

  const handleOnDelete = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleSaveChanges = useCallback(() => {
    setSaveDialogOpen(false);
    submitForm();
  }, [submitForm]);

  const handleDiscardChanges = useCallback(() => {
    setSaveDialogOpen(false);
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleDeleteItem = useCallback(() => {
    setDeleteDialogOpen(false);
    if (editId) {
      onDeleteItem(editId);
    }
  }, [editId, onDeleteItem]);

  // Scroll to top of form when switching between items
  useEffect(() => {
    document.getElementById(itemId)?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [editId, itemId]);

  useEffect(() => {
    onHasMadeChanges(!isDefaultValue && !saveDialogOpen && !deleteDialogOpen);
  }, [isDefaultValue, saveDialogOpen, deleteDialogOpen, onHasMadeChanges]);

  useHotkey(
    'Enter',
    () => {
      if (isDefaultValue) {
        onClose();
      } else {
        submitForm();
      }
    },
    {
      enabled: isTopVisibleItem,
      conflictBehavior: 'allow',
    },
  );

  return {
    isEditing,
    saveDialogOpen,
    deleteDialogOpen,
    handleOnClose,
    handleOnDelete,
    handleSaveChanges,
    handleDiscardChanges,
    handleDeleteItem,
    handleCloseSaveDialog,
    handleCloseDeleteDialog,
  };
};
