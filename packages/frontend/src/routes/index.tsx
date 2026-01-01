import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Run Mapper</h1>
      <p className="text-lg mb-6">
        Create and visualize your running routes with interactive iframes
      </p>
      <p className="text-gray-600">
        Welcome to Run Mapper! This app helps organizers of runs input their
        paths and get cool visual iframes for their runs.
      </p>
    </div>
  );
}
