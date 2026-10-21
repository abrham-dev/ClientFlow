import { useState } from 'react'

function ProjectForm({ clients, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState('Planning')

  function handleSubmit(event) {
    event.preventDefault()

    onCreate({
      name,
      description,
      status,
      clientId: Number(clientId),
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Add Project
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the project's information.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name
          </label>

          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Website Redesign"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the project..."
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="project-client"
            className="block text-sm font-medium text-gray-700"
          >
            Client
          </label>

          <select
            id="project-client"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="">Select a client</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          {clients.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              No clients found. Create a client before adding a project.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="project-status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="project-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="Planning">Planning</option>
            <option value="Active">active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={clients.length === 0}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Project
        </button>
      </form>
    </div>
  )
}

export default ProjectForm