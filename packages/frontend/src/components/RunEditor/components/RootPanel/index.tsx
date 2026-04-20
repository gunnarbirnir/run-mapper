import { Text, Button } from '~/primitives';

import { getRunEditorFormDefaults, withRunEditorForm } from '../../form';

export const RootPanel = withRunEditorForm({
  defaultValues: getRunEditorFormDefaults(),
  props: {
    handleOpenRoutePanel: () => {},
    handleOpenPointOfInterestPanel: () => {},
  },
  render: function Render({
    form,
    handleOpenRoutePanel,
    handleOpenPointOfInterestPanel,
  }) {
    return (
      <div className="space-y-8">
        <section className="flex flex-col gap-6">
          <form.AppField name="name">
            {(field) => <field.TextField label="Name" placeholder="Run name" />}
          </form.AppField>

          <form.AppField name="publicSlug">
            {(field) => (
              <field.TextField
                label="Public slug"
                placeholder="example-slug"
                infoText="Will be used in the URL for the run"
              />
            )}
          </form.AppField>
        </section>
        <section>
          <Text element="h3" className="mb-4">
            Points of Interest
          </Text>
          <Button className="w-full" onClick={handleOpenPointOfInterestPanel}>
            Add POI
          </Button>
        </section>
        <section>
          <Text element="h3" className="mb-4">
            Routes
          </Text>
          <Button className="w-full" onClick={handleOpenRoutePanel}>
            Add route
          </Button>
        </section>
      </div>
    );
  },
});
