import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { Text, Form, Button } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/playground/')({
  component: Playground,
});

export function Playground() {
  const [runSlug, setRunSlug] = useState('hauganes-marathon');
  const [runSlugInput, setRunSlugInput] = useState(runSlug);

  return (
    <PageLayout hideNavBar hideFooter>
      <PageLayout.MainContent>
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
            height="600"
            style={{ width: '100%', maxWidth: 900 }}
            src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/run/${runSlug}`}
          />
        )}
      </PageLayout.MainContent>
    </PageLayout>
  );
}
