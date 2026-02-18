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
  const [runSlug, setRunSlug] = useState('hauganes-marathon');
  const [runSlugInput, setRunSlugInput] = useState(runSlug);

  return (
    <div>
      <Text element="h1" className="mb-4">
        Playground
      </Text>
      <Form className="mb-8">
        <Form.TextInput
          id="run-slug"
          name="run-slug"
          label="Run Slug"
          placeholder="Enter a Run Slug"
          containerClassName="max-w-sm"
          value={runSlugInput}
          onChange={setRunSlugInput}
        />

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            onClick={() => setRunSlug(runSlugInput)}
            disabled={!runSlugInput || runSlugInput === runSlug}
          >
            Update
          </Button>
          <Text className="text-gray-400">Current Slug: {runSlug}</Text>
        </div>
      </Form>
      {runSlug && (
        <iframe
          height="500"
          style={{ width: '100%', maxWidth: 800 }}
          src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/public-runs/${runSlug}`}
        />
      )}
    </div>
  );
}
