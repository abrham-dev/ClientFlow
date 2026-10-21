import { useState } from 'react'

function TaskForm({ projects, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState('Todo')

  function handleSubmit(event) {
    event.preventDefault()

    onCreate({
      title,
      description,
      projectId: Number(projectId),
      status,
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Add Task
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the task's information.
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
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700"
          >
            Task Title
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="your  task"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the task"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-project"
            className="block text-sm font-medium text-gray-700"
          >
            Project
          </label>

          <select
            id="task-project"
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
            htmlFor="task-status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="task-status"
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
          Create Task
        </button>

        {projects.length === 0 && (
          <p className="text-sm text-gray-500">
            Create a project before adding a task.
          </p>
        )}
      </form>
    </div>
  )
}

export default TaskForm