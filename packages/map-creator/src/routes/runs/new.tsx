import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/runs/new')({
  component: NewRun,
})

function NewRun() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Create New Run</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Run Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter run name"
          />
        </div>
        <div>
          <label htmlFor="path" className="block mb-2 font-medium">
            Path Data
          </label>
          <textarea
            id="path"
            name="path"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter path coordinates or route data"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Run
        </button>
      </form>
    </div>
  )
}
