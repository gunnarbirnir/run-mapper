import { useForm, useStore } from '@tanstack/react-form';
import { motion } from 'motion/react';
import z from 'zod';

import { POINT_OF_INTEREST_VALUES } from '~/constants';
import { useId } from '~/hooks/useId';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { Form, SidePanel, Button, Text } from '~/primitives';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  RunUpdate,
} from '~/types';
import { getFieldError } from '~/utils';

import { ItemsSection } from '../ItemsSection';
import { PointOfInterestItem } from './PointOfInterestItem';
import { RouteItem } from './RouteItem';

interface RootPanelProps {
  existingRun?: EditorRun;
  currentRoutes: PublicRoute[];
  currentPointsOfInterest: PointOfInterest[];
  error?: Error | null;
  onClose: () => void;
  onAddRoute: () => void;
  onEditRoute: (id: string) => void;
  onAddPointOfInterest: () => void;
  onEditPointOfInterest: (id: string) => void;
  onSubmit: (run: RunUpdate) => void | Promise<unknown>;
}

const rootFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  publicSlug: z.string().regex(/^[a-z0-9-]{3,64}$/, 'Incorrect format'),
});

export const RootPanel = ({
  existingRun,
  currentRoutes,
  currentPointsOfInterest,
  error,
  onClose,
  onAddRoute,
  onEditRoute,
  onAddPointOfInterest,
  onEditPointOfInterest,
  onSubmit,
}: RootPanelProps) => {
  const nameId = useId('run-name');
  const publicSlugId = useId('public-slug');
  const { isSmallScreen } = useMediaQuery();
  const isEditing = Boolean(existingRun);

  const rootForm = useForm({
    defaultValues: {
      name: existingRun?.name || '',
      publicSlug: existingRun?.publicSlug || '',
    },
    validators: {
      onBlur: rootFormSchema,
      onSubmit: rootFormSchema,
    },
    onSubmit: async ({ value }) => {
      const updatedRun = {
        name: value.name,
        isPublic: true,
        publicSlug: value.publicSlug,
        routes: currentRoutes,
        pointsOfInterest: currentPointsOfInterest,
      };

      await onSubmit(updatedRun);
    },
  });

  const isDefaultValue = useStore(
    rootForm.store,
    (state) => state.isDefaultValue,
  );
  const isSubmitting = useStore(rootForm.store, (state) => state.isSubmitting);
  const canSubmit = useStore(rootForm.store, (state) => state.canSubmit);

  return (
    <SidePanel.Content
      key={existingRun?.id ?? 'new-run'}
      title={existingRun ? 'Edit run' : 'New run'}
      onClose={onClose}
    >
      <Form className="space-y-8" onSubmit={rootForm.handleSubmit}>
        <section className="flex flex-col gap-5">
          <rootForm.Field name="name">
            {(field) => (
              <Form.TextInput
                id={nameId}
                name="name"
                label="Name"
                placeholder="Run name"
                value={field.state.value}
                error={getFieldError(field)}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </rootForm.Field>
          <rootForm.Field name="publicSlug">
            {(field) => (
              <Form.TextInput
                id={publicSlugId}
                label="Public slug"
                name="publicSlug"
                placeholder="example-slug"
                infoText="Will be used in the URL for the run"
                value={field.state.value}
                error={getFieldError(field)}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </rootForm.Field>
        </section>
        <ItemsSection
          title="Routes"
          buttonLabel="Add route"
          emptyText="Your run can have multiple routes, one for each distance. Create the first one by clicking the plus."
          onAddClick={onAddRoute}
        >
          {currentRoutes.length > 0 ? (
            <motion.div layout className="space-y-3">
              {currentRoutes.map((route) => (
                <RouteItem
                  key={route.id}
                  route={route}
                  onEditRoute={onEditRoute}
                />
              ))}
            </motion.div>
          ) : null}
        </ItemsSection>
        <ItemsSection
          title="Points of interest"
          buttonLabel="Add POI"
          emptyText="Points of interest are notable locations related to your event. Create the first one by clicking the plus."
          onAddClick={onAddPointOfInterest}
        >
          {currentPointsOfInterest.length > 0 ? (
            <motion.div layout className="space-y-3">
              {currentPointsOfInterest
                .sort(
                  (a, b) =>
                    POINT_OF_INTEREST_VALUES.indexOf(a.type) -
                    POINT_OF_INTEREST_VALUES.indexOf(b.type),
                )
                .map((pointOfInterest) => (
                  <PointOfInterestItem
                    key={pointOfInterest.id}
                    pointOfInterest={pointOfInterest}
                    onEditPointOfInterest={onEditPointOfInterest}
                  />
                ))}
            </motion.div>
          ) : null}
        </ItemsSection>
        <section className="flex flex-col">
          {error && (
            <Text className="text-error-600 mb-5 text-xs">{error.message}</Text>
          )}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              type="submit"
              disabled={!canSubmit || isDefaultValue}
              isLoading={isSubmitting}
            >
              {isEditing ? 'Save run' : 'Create run'}
            </Button>
            <Button
              className="w-full"
              linkTo="/runs"
              color="gray"
              disabled={isSubmitting}
            >
              Back to runs
            </Button>
            {isEditing && (
              <Button
                color="errorOutline"
                className="w-full"
                // TODO: Delete run
                onClick={() => console.log('Delete run')}
                disabled={isSubmitting}
              >
                {isSmallScreen ? 'Delete' : 'Delete run'}
              </Button>
            )}
          </div>
        </section>
      </Form>
    </SidePanel.Content>
  );
};
