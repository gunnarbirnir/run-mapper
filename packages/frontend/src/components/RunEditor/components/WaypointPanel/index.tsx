import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo } from 'react';
import z from 'zod';

import { INNER_WAYPOINT_VALUES, WAYPOINT_VALUES } from '~/constants';
import { useId } from '~/hooks/useId';
import { Button, Dialog, Form, SidePanel } from '~/primitives';
import type { Waypoint, WaypointType, InnerWaypointType } from '~/types';
import { getWaypointPoiLabel } from '~/utils/route';

import { usePanelForm } from '../../hooks/usePanelForm';
import { PanelState } from '../../hooks/usePanelState';

interface WaypointPanelProps extends PanelState<Waypoint> {
  routeDistance: number | undefined;
}

const waypointFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string(),
  position: z.number().min(0, 'Position must be at least 0'),
  amenities: z.array(z.string()),
});

const innerWaypointTypeOptions = INNER_WAYPOINT_VALUES.map((type) => ({
  label: getWaypointPoiLabel(type),
  value: type,
}));
const waypointTypeOptions = WAYPOINT_VALUES.map((type) => ({
  label: getWaypointPoiLabel(type),
  value: type,
}));

export const WaypointPanel = ({
  editId,
  currentItems,
  routeDistance,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onHasMadeChanges,
  onClose,
}: WaypointPanelProps) => {
  const nameId = useId('waypoint-name');
  const typeId = useId('waypoint-type');
  const descriptionId = useId('waypoint-description');
  const positionId = useId('waypoint-position');
  const amenitiesId = useId('waypoint-amenities');
  const positionMax = routeDistance ?? 100;

  const formDefaultValues = useMemo(() => {
    const editWaypoint = currentItems.find(
      (waypoint) => waypoint.id === editId,
    );
    return {
      name: editWaypoint?.name || '',
      type: editWaypoint?.type || '',
      description: editWaypoint?.description || '',
      position:
        editWaypoint?.type === 'start'
          ? 0
          : editWaypoint?.type === 'end'
            ? positionMax
            : editWaypoint?.position || 0,
      amenities: (editWaypoint?.amenities || []) as string[],
    };
  }, [editId, currentItems, positionMax]);

  const waypointForm = useForm({
    defaultValues: formDefaultValues,
    validators: {
      onBlur: waypointFormSchema,
      onSubmit: waypointFormSchema,
    },
    onSubmit: ({ value }) => {
      const updatedWaypoint = {
        name: value.name,
        type: value.type as WaypointType,
        description: value.description,
        position: value.position,
        amenities: value.amenities as InnerWaypointType[],
        coordinates: { lat: 0, lng: 0 },
      };

      if (editId) {
        onUpdateItem(editId, updatedWaypoint);
      } else {
        onAddItem(updatedWaypoint);
      }
    },
  });

  const isDefaultValue = useStore(
    waypointForm.store,
    (state) => state.isDefaultValue,
  );
  const waypointType = useStore(
    waypointForm.store,
    (state) => state.values.type,
  );
  const isStartOrEnd = waypointType === 'start' || waypointType === 'end';

  const submitForm = useCallback(() => {
    waypointForm.handleSubmit();
  }, [waypointForm]);

  const resetForm = useCallback(() => {
    waypointForm.reset(formDefaultValues);
  }, [formDefaultValues, waypointForm]);

  const deleteWaypoint = useCallback(() => {
    if (editId) {
      onDeleteItem(editId);
    }
  }, [editId, onDeleteItem]);

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
    onDeleteItem: deleteWaypoint,
  });

  return (
    <SidePanel.Content
      key={editId ?? 'new-waypoint'}
      title={editId ? 'Edit waypoint' : 'Add waypoint'}
      onClose={handleOnClose}
    >
      <Form className="space-y-8" onSubmit={submitForm}>
        <section className="space-y-5">
          <waypointForm.Field name="name">
            {(field) => (
              <Form.TextInput
                id={nameId}
                name="name"
                label="Name"
                placeholder="Waypoint name"
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
          </waypointForm.Field>
          <waypointForm.Field
            name="type"
            listeners={{
              onChange: ({ value }) => {
                const amenities = waypointForm.getFieldValue('amenities');
                if (amenities.includes(value)) {
                  waypointForm.setFieldValue(
                    'amenities',
                    amenities.filter((a) => a !== value),
                  );
                }
              },
            }}
          >
            {(field) => (
              <Form.Dropdown
                id={typeId}
                label="Type"
                placeholder="Waypoint type"
                items={
                  isStartOrEnd ? waypointTypeOptions : innerWaypointTypeOptions
                }
                value={field.state.value}
                disabled={isStartOrEnd}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]?.message
                    : undefined
                }
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </waypointForm.Field>
          <waypointForm.Field name="description">
            {(field) => (
              <Form.TextArea
                id={descriptionId}
                name="description"
                label="Description"
                placeholder="Waypoint description"
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
          </waypointForm.Field>
          <waypointForm.Field name="position">
            {(field) => (
              <Form.Slider
                id={positionId}
                label={`Position: ${field.state.value} km`}
                infoText="Where on the route the waypoint is located"
                value={field.state.value}
                min={0}
                max={positionMax}
                step={0.1}
                disabled={isStartOrEnd}
                error={
                  field.state.value > positionMax
                    ? `Position cannot be greater than route distance (${positionMax} km)`
                    : undefined
                }
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </waypointForm.Field>
          <waypointForm.Field name="amenities">
            {(field) => (
              <Form.Dropdown
                id={amenitiesId}
                label="Amenities"
                placeholder="Waypoint amenities"
                infoText="Other amenities not included in the main type"
                items={innerWaypointTypeOptions.filter(
                  (t) => t.value !== waypointType,
                )}
                values={field.state.value}
                disabled={!waypointType}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]?.message
                    : undefined
                }
                onValuesChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </waypointForm.Field>
        </section>
        <section className="flex flex-col gap-3">
          <waypointForm.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDefaultValue,
              state.values.position > positionMax,
            ]}
            children={([
              canSubmit,
              isSubmitting,
              isDefaultValue,
              invalidPosition,
            ]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isDefaultValue || invalidPosition}
                isLoading={isSubmitting}
              >
                {isEditing ? 'Update waypoint' : 'Add waypoint'}
              </Button>
            )}
          />
          <Button color="gray" className="w-full" onClick={handleOnClose}>
            Cancel
          </Button>
          {isEditing && !isStartOrEnd && (
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
          title="Delete waypoint"
          description="Are you sure you want to delete this waypoint?"
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
