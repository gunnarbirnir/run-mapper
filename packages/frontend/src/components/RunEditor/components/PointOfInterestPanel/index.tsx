import { getRunEditorFormDefaults, withRunEditorForm } from '../../form';

export const PointOfInterestPanel = withRunEditorForm({
  defaultValues: getRunEditorFormDefaults(),
  render: function Render({ form }) {
    return (
      <div className="space-y-8">
        <section className="flex flex-col gap-6">
          <form.AppField name="name">
            {(field) => <field.TextField label="Name" placeholder="Run name" />}
          </form.AppField>
        </section>
      </div>
    );
  },
});
