import { createFileRoute, notFound } from '@tanstack/react-router';
import { useState } from 'react';

import { Text, Form, Button } from '~/primitives';

export const Route = createFileRoute('/playground/')({
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      throw notFound();
    }
  },
  component: Playground,
});

export function Playground() {
  const [runId, setRunId] = useState('test123');
  const [runIdInput, setRunIdInput] = useState(runId);

  return (
    <div>
      <Text element="h1" className="mb-4">
        Playground
      </Text>
      <Form className="mb-8">
        <Form.TextInput
          id="run-id"
          name="run-id"
          label="Run ID"
          placeholder="Enter a Run ID"
          containerClassName="max-w-sm"
          value={runIdInput}
          onChange={setRunIdInput}
        />

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            onClick={() => setRunId(runIdInput)}
            disabled={runIdInput === runId}
          >
            Update
          </Button>
          <Text className="text-gray-400">Current ID: {runId}</Text>
        </div>
      </Form>
      <iframe
        height="500"
        width="800"
        src={`http://localhost:3000/runs/${runId}`}
      />
    </div>
  );
}
