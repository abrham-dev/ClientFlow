import { useState } from 'react'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import TaskEditForm from '../components/TaskEditForm'

function Tasks() {
  const [showForm, setShowForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Fix login page',
      project: 'Website Redesign',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Create homepage',
      project: 'Mobile App',
      status: 'Todo',
    },
    {
      id: 3,
      title: 'Test checkout',
      project: 'E-commerce Store',
      status: 'Completed',
    },
    {
      id: 4,
      title: 'Create navigation',
      project: 'Website Design',
      status: 'Todo',
    },
    {
      id: 5,
      title: 'Build dashboard',
      project: 'SaaS',
      status: 'In Progress',
    },
    {
      id: 6,
      title: 'Test payment system',
      project: 'Website Design',
      status: 'Completed',
    },
  ])

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleCreateTask(task) {
    setTasks([...tasks, task])
    setShowForm(false)
  }

  function handleEditTask(updatedTask) {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    )

    setEditingTask(null)
  }

  function handleDeleteTask(taskId) {
    setTasks(
      tasks.filter((task) => task.id !== taskId)
    )

    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }

    if (editingTask?.id === taskId) {
      setEditingTask(null)
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your tasks and track their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Add Task
        </button>
      </div>

      {showForm && (
        <div className="mt-8">
          <TaskForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateTask}
          />
        </div>
      )}

      {selectedTask && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedTask.title}
          </h2>

          <p className="mt-2 text-gray-600">
            Project: {selectedTask.project}
          </p>

          <p className="mt-1 text-gray-600">
            Status: {selectedTask.status}
          </p>

          <button
            type="button"
            onClick={() => setSelectedTask(null)}
            className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      )}

      {editingTask && (
        <TaskEditForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}

      <div className="mt-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-gray-500"
        />
      </div>

      <div className="mt-8">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No tasks yet
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first task to get started.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No tasks found
            </h2>

            <p className="mt-2 text-gray-500">
              Try searching for a different task.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                project={task.project}
                status={task.status}
                onView={() => {
                  setEditingTask(null)
                  setSelectedTask(task)
                }}
                onEdit={() => {
                  setSelectedTask(null)
                  setEditingTask(task)
                }}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Tasks