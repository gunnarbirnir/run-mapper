import { useMemo, useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

import {
  PointOfInterest,
  PointOfInterestType,
  PointOfInterestTypeValues,
} from '~/types';
import {
  Form,
  Button,
  Text,
  SidePanel,
  useSidePanelItemContext,
} from '~/primitives';
import { useId } from '~/hooks/useId';
import { getWaypointPoiLabel } from '~/utils/route';

interface PointOfInterestPanelProps {
  editPointOfInterestId: string | null;
  currentPointsOfInterest: PointOfInterest[];
  handleUpdatePointsOfInterest: (pointsOfInterest: PointOfInterest[]) => void;
  onClose: () => void;
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

const pointOfInterestTypeOptions = PointOfInterestTypeValues.map((type) => ({
  label: getWaypointPoiLabel(type),
  value: type,
}));

export const PointOfInterestPanel = ({
  editPointOfInterestId,
  currentPointsOfInterest,
  handleUpdatePointsOfInterest,
  onClose,
}: PointOfInterestPanelProps) => {
  const nameId = useId('poi-name');
  const typeId = useId('poi-type');
  const descriptionId = useId('poi-description');
  const { itemId } = useSidePanelItemContext();
  const isEditing = Boolean(editPointOfInterestId);

  const formDefaultValues = useMemo(() => {
    const editPointOfInterest = currentPointsOfInterest.find(
      (poi) => poi.id === editPointOfInterestId,
    );
    return {
      name: editPointOfInterest?.name || '',
      type: editPointOfInterest?.type || '',
      description: editPointOfInterest?.description || '',
      lat: editPointOfInterest?.coordinates.lat,
      lng: editPointOfInterest?.coordinates.lng,
    };
  }, [editPointOfInterestId, currentPointsOfInterest]);

  const pointOfInterestForm = useForm({
    defaultValues: formDefaultValues,
    validators: {
      onBlur: pointOfInterestFormSchema,
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
      const editPointOfInterestIndex = currentPointsOfInterest.findIndex(
        (poi) => poi.id === editPointOfInterestId,
      );

      if (editPointOfInterestIndex !== -1) {
        const updatedPointsOfInterest = [...currentPointsOfInterest];
        updatedPointsOfInterest[editPointOfInterestIndex] = {
          ...updatedPointsOfInterest[editPointOfInterestIndex],
          ...updatedPointOfInterest,
        };
        handleUpdatePointsOfInterest(updatedPointsOfInterest);
      } else {
        handleUpdatePointsOfInterest([
          ...currentPointsOfInterest,
          {
            id: `new-poi-${Date.now()}`,
            ...updatedPointOfInterest,
          },
        ]);
      }
    },
  });

  const resetForm = useCallback(() => {
    pointOfInterestForm.reset(formDefaultValues);
  }, [formDefaultValues, pointOfInterestForm]);

  useEffect(() => {
    resetForm();
    document.getElementById(itemId)?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [editPointOfInterestId, resetForm, itemId]);

  return (
    <SidePanel.Content
      title={editPointOfInterestId ? 'Edit POI' : 'Add POI'}
      onClose={onClose}
    >
      <Form onSubmit={pointOfInterestForm.handleSubmit}>
        <div className="mb-6 space-y-5">
          <pointOfInterestForm.Field name="name">
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
          </pointOfInterestForm.Field>
          <pointOfInterestForm.Field name="type">
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
          </pointOfInterestForm.Field>
          <pointOfInterestForm.Field name="description">
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
          </pointOfInterestForm.Field>
          <div>
            <Text variant="label" className="mb-2">
              Coordinates
            </Text>
            <pointOfInterestForm.Field name="lat">
              {(field) => (
                <Text variant="subtle" className="text-sm">
                  <strong className="font-medium text-gray-900">lat: </strong>
                  {field.state.value ?? '-'}
                </Text>
              )}
            </pointOfInterestForm.Field>
            <pointOfInterestForm.Field name="lng">
              {(field) => (
                <Text variant="subtle" className="text-sm">
                  <strong className="font-medium text-gray-900">lng: </strong>
                  {field.state.value ?? '-'}
                </Text>
              )}
            </pointOfInterestForm.Field>
            <pointOfInterestForm.Subscribe
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
          <pointOfInterestForm.Subscribe
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
          <Button color="gray" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          {isEditing && (
            <Button color="error" className="w-full" onClick={onClose}>
              Delete
            </Button>
          )}
        </div>
      </Form>
    </SidePanel.Content>
  );
};
