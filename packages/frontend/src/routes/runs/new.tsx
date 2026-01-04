import { createFileRoute } from '@tanstack/react-router';

import { Text, Button, Form } from '~/primitives';

export const Route = createFileRoute('/runs/new')({
  component: NewRun,
});

function NewRun() {
  return (
    <div>
      <Text element="h1" className="mb-4">
        Create New Run
      </Text>
      <Form>
        <Form.TextInput
          id="name"
          name="name"
          label="Run Name"
          placeholder="Enter run name"
          value=""
          onChange={() => {}}
        />
        <Form.TextArea
          id="path"
          name="path"
          label="Path Data"
          placeholder="Enter path coordinates or route data"
        />
        <Button type="submit">Create Run</Button>
      </Form>
    </div>
  );
}
