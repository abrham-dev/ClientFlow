'use client'

import { useState, type ChangeEvent, type SyntheticEvent } from 'react'

// Define the structure of a client.
type Client = {
  id: number
  name: string
}

// Define the structure of a project.
type Project = {
  id: number
  name: string
  description: string
  status: string
  clientId: number
}

// Define the information and functions this component receives.
type ProjectEditFormProps = {
  project: Project
  clients: Client[]
  onClose: () => void
  onSave: (project: Project) => void
}

function ProjectEditForm({
  project,
  clients,
  onClose,
  onSave,
}: ProjectEditFormProps) {
  // Initialize the form with the existing project information.
  const [name, setName] = useState(project.name)
  const [clientId, setClientId] = useState(String(project.clientId))
  const [status, setStatus] = useState(project.status)
  const [description, setDescription] = useState(
    project.description || ''
  )

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      ...project,
      name,
      description,
      clientId: Number(clientId),
      status,
    })
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Project
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the project's information.
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
            htmlFor="edit-project-name"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name
          </label>

          <input
            id="edit-project-name"
            type="text"
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-project-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>

          <textarea
            id="edit-project-description"
            value={description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(event.target.value)
            }
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-project-client"
            className="block text-sm font-medium text-gray-700"
          >
            Client
          </label>

          <select
            id="edit-project-client"
            value={clientId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setClientId(event.target.value)
            }
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="">Select a client</option>

            {clients.map((client) => (
              <option key={client.id} value={String(client.id)}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-project-status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="edit-project-status"
            value={status}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setStatus(event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ProjectEditForm