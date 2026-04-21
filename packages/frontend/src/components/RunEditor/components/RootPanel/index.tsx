import { useForm } from '@tanstack/react-form';

import type { EditorRun, PointOfInterest } from '~/types';
import { Text, Button, Form } from '~/primitives';
import { useId } from '~/hooks/useId';

import { PointOfInterestItem } from './PointOfInterestItem';

interface RootPanelProps {
  existingRun?: EditorRun;
  currentPointsOfInterest: PointOfInterest[];
  handleOpenRoutePanel: () => void;
  handleAddPointOfInterest: () => void;
  handleEditPointOfInterest: (id: string) => void;
}

export const RootPanel = ({
  existingRun,
  currentPointsOfInterest,
  handleOpenRoutePanel,
  handleAddPointOfInterest,
  handleEditPointOfInterest,
}: RootPanelProps) => {
  const rootForm = useForm({
    defaultValues: {
      name: existingRun?.name || '',
      publicSlug: existingRun?.publicSlug || '',
    },
    // onSubmit: ({ value }) => {}
  });
  const nameId = useId('run-name');
  const publicSlugId = useId('public-slug');

  return (
    <Form className="space-y-8" onSubmit={rootForm.handleSubmit}>
      <section className="flex flex-col gap-6">
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
        <Text element="h3" className="mb-4">
          Routes
        </Text>
        <Button className="w-full" onClick={handleOpenRoutePanel}>
          Add route
        </Button>
      </section>
      <section>
        <Text element="h3" className="mb-4">
          Points of interest
        </Text>
        {currentPointsOfInterest.length > 0 && (
          <div className="mb-6 space-y-2">
            {currentPointsOfInterest.map((pointOfInterest) => (
              <PointOfInterestItem
                key={pointOfInterest.id}
                pointOfInterest={pointOfInterest}
                handleEditPointOfInterest={handleEditPointOfInterest}
              />
            ))}
          </div>
        )}
        <Button className="w-full" onClick={handleAddPointOfInterest}>
          Add POI
        </Button>
      </section>
    </Form>
  );
};
