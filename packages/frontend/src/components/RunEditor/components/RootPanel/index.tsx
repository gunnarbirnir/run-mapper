import { useForm } from '@tanstack/react-form';
import { motion } from 'motion/react';

import { useId } from '~/hooks/useId';
import { Button, Form, SidePanel, Text } from '~/primitives';
import type { EditorRun, PointOfInterest } from '~/types';
import { POINT_OF_INTEREST_VALUES } from '~/constants';

import { PointOfInterestItem } from './PointOfInterestItem';

interface RootPanelProps {
  existingRun?: EditorRun;
  currentPointsOfInterest: PointOfInterest[];
  onClose: () => void;
  onOpenRoutePanel: () => void;
  onAddPointOfInterest: () => void;
  onEditPointOfInterest: (id: string) => void;
}

export const RootPanel = ({
  existingRun,
  currentPointsOfInterest,
  onClose,
  onOpenRoutePanel,
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

  return (
    <SidePanel.Content
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
        <section>
          <Text element="h3">Routes</Text>
          <Text variant="subtle" className="mt-3 mb-5 text-sm">
            Your run can have multiple routes, one for each distance. Create the
            first one here:
          </Text>
          <Button className="w-full" onClick={onOpenRoutePanel}>
            Add route
          </Button>
        </section>
        <section>
          <Text element="h3">Points of interest</Text>
          {currentPointsOfInterest.length > 0 ? (
            <motion.div layout className="mt-4 mb-6 space-y-3">
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
          ) : (
            <Text variant="subtle" className="mt-3 mb-5 text-sm">
              Points of interest are notable locations related to your running
              event. Create the first one here:
            </Text>
          )}
          <Button className="w-full" onClick={onAddPointOfInterest}>
            Add POI
          </Button>
        </section>
      </Form>
    </SidePanel.Content>
  );
};
