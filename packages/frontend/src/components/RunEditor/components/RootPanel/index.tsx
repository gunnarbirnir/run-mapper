import { useForm } from '@tanstack/react-form';
import { motion } from 'motion/react';

import { POINT_OF_INTEREST_VALUES } from '~/constants';
import { useId } from '~/hooks/useId';
import { Form, SidePanel, Button } from '~/primitives';
import type { EditorRun, PointOfInterest, PublicRoute } from '~/types';

import { ItemsSection } from '../ItemsSection';
import { PointOfInterestItem } from './PointOfInterestItem';
import { RouteItem } from './RouteItem';

interface RootPanelProps {
  existingRun?: EditorRun;
  currentRoutes: PublicRoute[];
  currentPointsOfInterest: PointOfInterest[];
  onClose: () => void;
  onAddRoute: () => void;
  onEditRoute: (id: string) => void;
  onAddPointOfInterest: () => void;
  onEditPointOfInterest: (id: string) => void;
}

export const RootPanel = ({
  existingRun,
  currentRoutes,
  currentPointsOfInterest,
  onClose,
  onAddRoute,
  onEditRoute,
  onAddPointOfInterest,
  onEditPointOfInterest,
}: RootPanelProps) => {
  const nameId = useId('run-name');
  const publicSlugId = useId('public-slug');
  const rootForm = useForm({
    defaultValues: {
      name: existingRun?.name || '',
      publicSlug: existingRun?.publicSlug || '',
    },
    // onSubmit: ({ value }) => {}
  });
  const isEditing = Boolean(existingRun);

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
                onChange={field.handleChange}
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
                onChange={field.handleChange}
              />
            )}
          </rootForm.Field>
        </section>
        <ItemsSection
          title="Routes"
          buttonLabel="Add route"
          emptyText="Your run can have multiple routes, one for each distance. Create the first one here:"
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
          emptyText="Points of interest are notable locations related to your running event. Create the first one here:"
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
        <section className="flex flex-col gap-3">
          <Button className="w-full" linkTo="/runs">
            Back to runs
          </Button>
          {isEditing && (
            <Button
              color="error"
              className="w-full"
              // TODO: Delete run
              onClick={() => console.log('Delete run')}
            >
              Delete run
            </Button>
          )}
        </section>
      </Form>
    </SidePanel.Content>
  );
};
