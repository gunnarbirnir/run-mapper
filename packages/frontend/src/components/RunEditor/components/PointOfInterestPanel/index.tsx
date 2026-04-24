import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { useHotkey } from '@tanstack/react-hotkeys';
import z from 'zod';

import type { PointOfInterest, PointOfInterestType } from '~/types';
import { POINT_OF_INTEREST_VALUES } from '~/constants';
import {
  Form,
  Button,
  Text,
  SidePanel,
  useSidePanelItemContext,
  Dialog,
} from '~/primitives';
import { useId } from '~/hooks/useId';
import { getWaypointPoiLabel } from '~/utils/route';

import type { PanelState } from '../../hooks/usePanelState';

const pointOfInterestFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string(),
  lat: z
    .number('Coordinates are required')
    .refine((val) => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
  lng: z
    .number('Coordinates are required')
    .refine((val) => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
});

const pointOfInterestTypeOptions = POINT_OF_INTEREST_VALUES.map((type) => ({
  label: getWaypointPoiLabel(type),
  value: type,
}));

export const PointOfInterestPanel = ({
  editId,
  currentItems,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onHasMadeChanges,
  onClose,
}: PanelState<PointOfInterest>) => {
  const nameId = useId('poi-name');
  const typeId = useId('poi-type');
  const descriptionId = useId('poi-description');
  const { itemId, isTopVisibleItem } = useSidePanelItemContext();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditing = Boolean(editId);

  const formDefaultValues = useMemo(() => {
    const editPointOfInterest = currentItems.find((poi) => poi.id === editId);
    return {
      name: editPointOfInterest?.name || '',
      type: editPointOfInterest?.type || '',
      description: editPointOfInterest?.description || '',
      lat: editPointOfInterest?.coordinates.lat,
      lng: editPointOfInterest?.coordinates.lng,
    };
  }, [editId, currentItems]);

  const poiForm = useForm({
    defaultValues: formDefaultValues,
    validators: {
      onBlur: pointOfInterestFormSchema,
      onSubmit: pointOfInterestFormSchema,
    },
    onSubmit: ({ value }) => {
      const updatedPointOfInterest = {
        name: value.name,
        type: value.type as PointOfInterestType,
        description: value.description,
        coordinates: {
          lat: value.lat as number,
          lng: value.lng as number,
        },
      };

      if (editId) {
        onUpdateItem(editId, updatedPointOfInterest);
      } else {
        onAddItem(updatedPointOfInterest);
      }
    },
  });

  const isDefaultValue = useStore(
    poiForm.store,
    (state) => state.isDefaultValue,
  );

  const resetForm = useCallback(() => {
    poiForm.reset(formDefaultValues);
  }, [formDefaultValues, poiForm]);

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
        poiForm.handleSubmit();
      }
    },
    {
      enabled: isTopVisibleItem,
      conflictBehavior: 'allow',
    },
  );

  return (
    <SidePanel.Content
      title={isEditing ? 'Edit POI' : 'Add POI'}
      onClose={handleOnClose}
    >
      <Form onSubmit={poiForm.handleSubmit}>
        <div className="mb-6 space-y-5">
          <poiForm.Field name="name">
            {(field) => (
              <Form.TextInput
                id={nameId}
                name="name"
                label="Name"
                placeholder="POI name"
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
          </poiForm.Field>
          <poiForm.Field name="type">
            {(field) => (
              <Form.Dropdown
                id={typeId}
                label="Type"
                items={pointOfInterestTypeOptions}
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
          </poiForm.Field>
          <poiForm.Field name="description">
            {(field) => (
              <Form.TextArea
                id={descriptionId}
                name="description"
                label="Description"
                placeholder="POI description"
                className="h-40 max-h-60 min-h-20"
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
          </poiForm.Field>
          <div>
            <Text variant="label" className="mb-2">
              Coordinates
            </Text>
            <poiForm.Field name="lat">
              {(field) => (
                <Text variant="subtle" className="text-sm">
                  <strong className="font-medium text-gray-900">lat: </strong>
                  {field.state.value ?? '-'}
                </Text>
              )}
            </poiForm.Field>
            <poiForm.Field name="lng">
              {(field) => (
                <Text variant="subtle" className="text-sm">
                  <strong className="font-medium text-gray-900">lng: </strong>
                  {field.state.value ?? '-'}
                </Text>
              )}
            </poiForm.Field>
            <poiForm.Subscribe
              selector={(state) => [
                state.submissionAttempts > 0,
                state.fieldMeta.lat?.errors[0],
                state.fieldMeta.lng?.errors[0],
              ]}
              children={([hasSubmitted, latError, lngError]) =>
                hasSubmitted && (latError || lngError) ? (
                  <Text className="text-error-600 mt-2 text-xs">
                    {latError ? latError.message : lngError?.message}
                  </Text>
                ) : (
                  <Text variant="subtle" className="mt-3 text-xs">
                    Click on the map to update the coordinates of the point of
                    interest.
                  </Text>
                )
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <poiForm.Subscribe
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
                {isEditing ? 'Update POI' : 'Add POI'}
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
                poiForm.handleSubmit();
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
          title="Delete POI"
          description="Are you sure you want to delete this point of interest?"
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
