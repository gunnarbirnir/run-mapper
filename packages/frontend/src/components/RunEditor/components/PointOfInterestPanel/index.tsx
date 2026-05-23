import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo } from 'react';
import z from 'zod';

import { POINT_OF_INTEREST_VALUES } from '~/constants';
import { useId } from '~/hooks/useId';
import { Button, Dialog, Form, SidePanel, Text } from '~/primitives';
import type { PointOfInterest, PointOfInterestType } from '~/types';
import { getWaypointPoiLabel } from '~/utils/route';

import { usePanelForm } from '../../hooks/usePanelForm';
import type { PanelState } from '../../hooks/usePanelState';

interface PointOfInterestPanelProps extends PanelState<PointOfInterest> {
  isEditingPoiCoordinates: string | null;
  setIsEditingPoiCoordinates: (poiId: string | null) => void;
}

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
  isEditingPoiCoordinates,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onHasMadeChanges,
  onClose,
  setIsEditingPoiCoordinates,
}: PointOfInterestPanelProps) => {
  const nameId = useId('poi-name');
  const typeId = useId('poi-type');
  const descriptionId = useId('poi-description');

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

  const isDefaultValue =
    useStore(poiForm.store, (state) => state.isDefaultValue) &&
    !isEditingPoiCoordinates;

  const submitForm = useCallback(() => {
    poiForm.handleSubmit();
  }, [poiForm]);

  const resetForm = useCallback(() => {
    poiForm.reset(formDefaultValues);
  }, [formDefaultValues, poiForm]);

  const closePanel = useCallback(() => {
    onClose();
    setIsEditingPoiCoordinates(null);
  }, [onClose, setIsEditingPoiCoordinates]);

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
    onClose: closePanel,
    resetForm,
    submitForm,
    onHasMadeChanges,
    onDeleteItem,
  });

  return (
    <SidePanel.Content
      key={editId ?? 'new-poi'}
      title={isEditing ? 'Edit POI' : 'Add POI'}
      onClose={handleOnClose}
    >
      <Form className="space-y-8" onSubmit={submitForm}>
        <section className="space-y-5">
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
                placeholder="POI type"
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
            <Button
              color="secondary"
              size="small"
              className="mt-3"
              onClick={() =>
                setIsEditingPoiCoordinates(
                  isEditingPoiCoordinates ? null : (editId ?? 'new-poi'),
                )
              }
            >
              {isEditingPoiCoordinates ? 'Stop editing' : 'Edit coordinates'}
            </Button>
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
                ) : null
              }
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
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
            <Button color="error" className="w-full" onClick={handleOnDelete}>
              Delete
            </Button>
          )}
        </section>
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
              label: 'Discard',
              color: 'error',
              onClick: handleDiscardChanges,
            },
          ]}
          onClose={handleCloseSaveDialog}
        />
        <Dialog
          title="Delete POI"
          description="Are you sure you want to delete this point of interest?"
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
