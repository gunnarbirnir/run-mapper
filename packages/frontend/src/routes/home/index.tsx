import { Text } from '~/primitives';

export function Home() {
  return (
    <div>
      <Text element="h1" className="mb-4">
        Run Mapper
      </Text>
      <Text variant="subtitle" className="mb-6">
        Create and visualize your running routes with interactive iframes
      </Text>
      <Text>
        Welcome to Run Mapper! This app helps organizers of runs input their
        paths and get cool visual iframes for their runs.
      </Text>
    </div>
  );
}
