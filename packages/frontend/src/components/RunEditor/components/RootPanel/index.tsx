import { getRunEditorFormDefaults, withRunEditorForm } from '../../form';

export const RootPanel = withRunEditorForm({
  defaultValues: getRunEditorFormDefaults(),
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-6">
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
      </div>
    );
  },
});
