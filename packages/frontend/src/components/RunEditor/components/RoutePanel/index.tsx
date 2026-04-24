import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { useHotkey } from '@tanstack/react-hotkeys';
import z from 'zod';

import {
  Dialog,
  Button,
  SidePanel,
  useSidePanelItemContext,
  Form,
} from '~/primitives';
import { PublicRoute, BoundingBox } from '~/types';
import { useId } from '~/hooks/useId';

import type { PanelState } from '../../hooks/usePanelState';

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
  const { itemId, isTopVisibleItem } = useSidePanelItemContext();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditing = Boolean(editId);

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

  const resetForm = useCallback(() => {
    routeForm.reset(formDefaultValues);
  }, [formDefaultValues, routeForm]);

  const handleOnClose = useCallback(() => {
    if (isDefaultValue) {
      onClose();
    } else {
      setCloseDialogOpen(true);
    }
  }, [isDefaultValue, onClose]);

  useEffect(() => {
    resetForm();
    document.getElementById(itemId)?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [editId, resetForm, itemId]);

  useEffect(() => {
    onHasMadeChanges(!isDefaultValue && !closeDialogOpen && !deleteDialogOpen);
  }, [isDefaultValue, closeDialogOpen, deleteDialogOpen, onHasMadeChanges]);

  useHotkey(
    'Enter',
    () => {
      if (isDefaultValue) {
        onClose();
      } else {
        routeForm.handleSubmit();
      }
    },
    {
      enabled: isTopVisibleItem,
      conflictBehavior: 'allow',
    },
  );

  return (
    <SidePanel.Content
      title={isEditing ? 'Edit route' : 'Add route'}
      onClose={handleOnClose}
    >
      <Form onSubmit={routeForm.handleSubmit}>
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
            <Button
              color="error"
              className="w-full"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </div>
        <Dialog
          title="Save changes"
          description="Are you sure you want to close without saving your changes?"
          isOpen={closeDialogOpen}
          buttons={[
            {
              label: 'Save',
              onClick: () => {
                setCloseDialogOpen(false);
                routeForm.handleSubmit();
              },
            },
            {
              label: 'Close',
              onClick: () => {
                setCloseDialogOpen(false);
                resetForm();
                onClose();
              },
            },
          ]}
          onClose={() => setCloseDialogOpen(false)}
        />
        <Dialog
          title="Delete Route"
          description="Are you sure you want to delete this route?"
          isOpen={deleteDialogOpen}
          buttons={[
            {
              label: 'Delete',
              color: 'error',
              onClick: () => {
                setDeleteDialogOpen(false);
                if (editId) {
                  onDeleteItem(editId);
                }
              },
            },
            {
              label: 'Cancel',
              onClick: () => setDeleteDialogOpen(false),
            },
          ]}
          onClose={() => setDeleteDialogOpen(false)}
        />
      </Form>
    </SidePanel.Content>
  );
};
