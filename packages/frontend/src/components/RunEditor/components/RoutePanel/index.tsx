import { Text, Button } from '~/primitives';

import { getRunEditorFormDefaults, withRunEditorForm } from '../../form';

export const RoutePanel = withRunEditorForm({
  defaultValues: getRunEditorFormDefaults(),
  props: {
    handleOpenWaypointPanel: () => {},
  },
  render: function Render({ form, handleOpenWaypointPanel }) {
    return (
      <div className="space-y-8">
        <section className="flex flex-col gap-6">
          <form.AppField name="name">
            {(field) => <field.TextField label="Name" placeholder="Run name" />}
          </form.AppField>
        </section>
        <section>
          <Text element="h3" className="mb-4">
            Waypoints
          </Text>
          <Button className="w-full" onClick={handleOpenWaypointPanel}>
            Add Waypoint
          </Button>
        </section>
      </div>
    );
  },
});
