import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/runs/$runId')({
  component: RunDetail,
})

function RunDetail() {
  const { runId } = Route.useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Run Details</h1>
      <p className="text-gray-600 mb-4">Run ID: {runId}</p>
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Visualization</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">
            Interactive iframe visualization will appear here
          </p>
        </div>
      </div>
    </div>
  )
}
