import { createFileRoute } from '@tanstack/react-router';

import { Button, Text } from '~/primitives';

export const Route = createFileRoute('/runs/')({
  component: RunsList,
});

function RunsList() {
  return (
    <div>
      <Text element="h1" className="mb-4">
        All Runs
      </Text>
      <Text className="mb-6">View and manage your running routes</Text>
      <Button linkTo="/runs/new">Create New Run</Button>
    </div>
  );
}
