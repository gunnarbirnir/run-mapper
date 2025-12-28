import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/runs')({
  component: RunsList,
})

function RunsList() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">All Runs</h1>
      <p className="text-gray-600 mb-4">
        View and manage your running routes
      </p>
      <Link
        to="/runs/new"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New Run
      </Link>
    </div>
  )
}
