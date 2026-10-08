import { useState } from 'react'

function ProjectForm({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [status, setStatus] = useState('Planning')

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

      <form
        onSubmit={(event) => {
          event.preventDefault()

          onCreate({
            id: Date.now(),
            name,
            client,
            status,
          })
        }}
        className="mt-6 space-y-4"
      >
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
            htmlFor="project-client"
            className="block text-sm font-medium text-gray-700"
          >
            Client
          </label>

          <input
            id="project-client"
            type="text"
            value={client}
            onChange={(event) => setClient(event.target.value)}
            placeholder="Acme Corporation"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
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
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Create Project
        </button>
      </form>
    </div>
  )
}

export default ProjectForm