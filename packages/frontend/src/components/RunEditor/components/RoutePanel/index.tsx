import { useForm, useStore } from '@tanstack/react-form';
import { motion } from 'motion/react';
import { useCallback, useMemo } from 'react';
import z from 'zod';

import { useId } from '~/hooks/useId';
import { Button, Dialog, Form, SidePanel } from '~/primitives';
import { BoundingBox, PublicRoute, Waypoint } from '~/types';
import { formatNumber } from '~/utils';

import { usePanelForm } from '../../hooks/usePanelForm';
import type { PanelState } from '../../hooks/usePanelState';
import { isUnchangedDefaultWaypoints, sortWaypoints } from '../../utils';
import { ItemsSection } from '../ItemsSection';
import { WaypointItem } from './WaypointItem';

interface RoutePanelProps extends PanelState<PublicRoute> {
  currentWaypoints: Waypoint[];
  routeDistance: number;
  isEditingRouteCoordinates: string | null;
  onAddWaypoint: () => void;
  onEditWaypoint: (waypointId: string) => void;
  setIsEditingRouteCoordinates: (routeId: string | null) => void;
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
  currentWaypoints,
  routeDistance,
  isEditingRouteCoordinates,
  onClose,
  onUpdateItem,
  onAddItem,
  onHasMadeChanges,
  onDeleteItem,
  onAddWaypoint,
  onEditWaypoint,
  setIsEditingRouteCoordinates,
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

  const hasDefaultWaypoints = useMemo(() => {
    return isUnchangedDefaultWaypoints(currentWaypoints);
  }, [currentWaypoints]);

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
      };

      if (editId) {
        onUpdateItem(editId, updatedRoute);
      } else {
        onAddItem({ ...updatedRoute, waypoints: currentWaypoints });
      }
    },
  });

  // Only applies to new routes because when editing, waypoints can be saved on their own
  const hasMadeWaypointChanges = !editId && !hasDefaultWaypoints;
  const isDefaultValue =
    useStore(routeForm.store, (state) => state.isDefaultValue) &&
    !hasMadeWaypointChanges &&
    !isEditingRouteCoordinates;

  const submitForm = useCallback(() => {
    routeForm.handleSubmit();
  }, [routeForm]);

  const resetForm = useCallback(() => {
    routeForm.reset(formDefaultValues);
  }, [formDefaultValues, routeForm]);

  const closePanel = useCallback(() => {
    onClose();
    setIsEditingRouteCoordinates(null);
  }, [onClose, setIsEditingRouteCoordinates]);

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
      key={editId ?? 'new-route'}
      title={isEditing ? 'Edit route' : 'Add route'}
      onClose={handleOnClose}
    >
      <Form className="space-y-8" onSubmit={submitForm}>
        <section className="space-y-5">
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
                infoText="In case the distance of the actual route is slightly off. Unit is km."
                placeholder="12.34 km"
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
        </section>
        <ItemsSection
          title="Coordinates"
          emptyText={
            routeDistance
              ? `Route distance: ${formatNumber(routeDistance, 2)} km`
              : 'The route itself is created in the map. Click the button below to start editing the route.'
          }
          showEmptyText
        >
          <Button
            color="secondary"
            size="small"
            onClick={() =>
              setIsEditingRouteCoordinates(
                isEditingRouteCoordinates ? null : (editId ?? 'new-route'),
              )
            }
          >
            {isEditingRouteCoordinates ? 'Stop editing' : 'Edit coordinates'}
          </Button>
        </ItemsSection>
        <ItemsSection
          title="Waypoints"
          emptyText="Waypoints are notable locations along the route. Start and End are default."
          showEmptyText={hasDefaultWaypoints}
          buttonLabel="Add waypoint"
          onAddClick={onAddWaypoint}
        >
          {currentWaypoints.length > 0 ? (
            <motion.div
              layout
              key={editId ?? 'new-route'}
              className="space-y-3"
            >
              {currentWaypoints
                .sort(sortWaypoints(routeDistance))
                .map((waypoint) => (
                  <WaypointItem
                    key={waypoint.id}
                    waypoint={waypoint}
                    error={waypoint.position > routeDistance}
                    onEditWaypoint={onEditWaypoint}
                  />
                ))}
            </motion.div>
          ) : null}
        </ItemsSection>
        <section className="flex flex-col gap-3">
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
