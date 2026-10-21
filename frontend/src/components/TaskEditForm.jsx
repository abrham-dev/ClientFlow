import { useState } from 'react'

function TaskEditForm({ task, projects, onClose, onSave }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [projectId, setProjectId] = useState(String(task.projectId))
  const [status, setStatus] = useState(task.status)

  function handleSubmit(event) {
    event.preventDefault()

    onSave({
      ...task,
      title,
      description,
      projectId: Number(projectId),
      status,
    })
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Task
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the task's information.
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
            htmlFor="edit-task-title"
            className="block text-sm font-medium text-gray-700"
          >
            Task Title
          </label>

          <input
            id="edit-task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-task-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="edit-task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-task-project"
            className="block text-sm font-medium text-gray-700"
          >
            Project
          </label>

          <select
            id="edit-task-project"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="">Select a project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-task-status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="edit-task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={projects.length === 0}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default TaskEditForm