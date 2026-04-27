import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo } from 'react';
import z from 'zod';

import { useId } from '~/hooks/useId';
import { Button, Dialog, Form, SidePanel } from '~/primitives';
import { BoundingBox, PublicRoute } from '~/types';

import type { PanelState } from '../../hooks/usePanelState';
import { usePanelForm } from '../../hooks/usePanelForm';

interface RoutePanelProps extends PanelState<PublicRoute> {
  onOpenWaypointPanel: () => void;
}

const routeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayDistance: z
    .string()
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Incorrect format')
    .or(z.literal('')),
});

export const RoutePanel = ({
  editId,
  currentItems,
  onClose,
  onUpdateItem,
  onAddItem,
  onHasMadeChanges,
  onDeleteItem,
  // onOpenWaypointPanel,
}: RoutePanelProps) => {
  const nameId = useId('route-name');
  const distanceId = useId('route-distance');

  const formDefaultValues = useMemo(() => {
    const editRoute = currentItems.find((route) => route.id === editId);
    return {
      name: editRoute?.name || '',
      displayDistance: editRoute?.displayDistance?.toString() || '',
    };
  }, [editId, currentItems]);

  const routeForm = useForm({
    defaultValues: formDefaultValues,
    validators: {
      onBlur: routeFormSchema,
      onSubmit: routeFormSchema,
    },
    onSubmit: ({ value }) => {
      const updatedRoute = {
        name: value.name,
        displayDistance: value.displayDistance
          ? Number(value.displayDistance)
          : undefined,
        boundingBox: [
          { lat: 0, lng: 0 },
          { lat: 0, lng: 0 },
        ] as BoundingBox,
        coordinates: [],
        waypoints: [],
      };

      if (editId) {
        onUpdateItem(editId, updatedRoute);
      } else {
        onAddItem(updatedRoute);
      }
    },
  });

  const isDefaultValue = useStore(
    routeForm.store,
    (state) => state.isDefaultValue,
  );

  const submitForm = useCallback(() => {
    routeForm.handleSubmit();
  }, [routeForm]);

  const resetForm = useCallback(() => {
    routeForm.reset(formDefaultValues);
  }, [formDefaultValues, routeForm]);

  const {
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
  } = usePanelForm({
    editId,
    isDefaultValue,
    onClose,
    resetForm,
    submitForm,
    onHasMadeChanges,
    onDeleteItem,
  });

  return (
    <SidePanel.Content
      title={isEditing ? 'Edit route' : 'Add route'}
      onClose={handleOnClose}
    >
      <Form onSubmit={submitForm}>
        <div className="mb-6 space-y-5">
          <routeForm.Field name="name">
            {(field) => (
              <Form.TextInput
                id={nameId}
                name="name"
                label="Name"
                placeholder="Route name"
                value={field.state.value}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]?.message
                    : undefined
                }
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </routeForm.Field>
          <routeForm.Field name="displayDistance">
            {(field) => (
              <Form.TextInput
                id={distanceId}
                name="displayDistance"
                label="Display distance"
                infoText="In case the distance of the actual route is slightly off"
                placeholder="12.34"
                value={field.state.value}
                pattern="[0-9]+(\.[0-9]{0,2})?"
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]?.message
                    : undefined
                }
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </routeForm.Field>
        </div>
        <div className="flex flex-col gap-3">
          <routeForm.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDefaultValue,
            ]}
            children={([canSubmit, isSubmitting, isDefaultValue]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isDefaultValue}
                isLoading={isSubmitting}
              >
                {isEditing ? 'Update Route' : 'Add Route'}
              </Button>
            )}
          />
          <Button color="gray" className="w-full" onClick={handleOnClose}>
            Cancel
          </Button>
          {isEditing && (
            <Button color="error" className="w-full" onClick={handleOnDelete}>
              Delete
            </Button>
          )}
        </div>
        <Dialog
          title="Save changes"
          description="Are you sure you want to close without saving your changes?"
          isOpen={saveDialogOpen}
          buttons={[
            {
              label: 'Save',
              onClick: handleSaveChanges,
            },
            {
              label: 'Close',
              onClick: handleDiscardChanges,
            },
          ]}
          onClose={handleCloseSaveDialog}
        />
        <Dialog
          title="Delete Route"
          description="Are you sure you want to delete this route?"
          isOpen={deleteDialogOpen}
          buttons={[
            {
              label: 'Delete',
              color: 'error',
              onClick: handleDeleteItem,
            },
            {
              label: 'Cancel',
              onClick: handleCloseDeleteDialog,
            },
          ]}
          onClose={handleCloseDeleteDialog}
        />
      </Form>
    </SidePanel.Content>
  );
};
