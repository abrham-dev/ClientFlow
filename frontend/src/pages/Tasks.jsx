import { useState, useEffect} from 'react'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import TaskEditForm from '../components/TaskEditForm'

function Tasks() {
  const [showForm, setShowForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
  async function fetchData() {
    const token = localStorage.getItem('token')

    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      if (!tasksResponse.ok) {
  const errorData = await tasksResponse.json()
  console.error('Tasks API error:', tasksResponse.status, errorData)
}

if (!projectsResponse.ok) {
  const errorData = await projectsResponse.json()
  console.error('Projects API error:', projectsResponse.status, errorData)
}

if (!tasksResponse.ok || !projectsResponse.ok) {
  throw new Error('Failed to load tasks or projects')
}

      const tasksData = await tasksResponse.json()
      const projectsData = await projectsResponse.json()

    setProjects(projectsData)

const tasksWithProjects = tasksData.map((task) => {
  const project = projectsData.find(
    (project) => project.id === task.projectId
  )

  return {
    ...task,
    project: project?.name || 'Unknown project',
  }
})

setTasks(tasksWithProjects)

console.log('Projects loaded:', projectsData)

    } catch (error) {
      console.error('Error loading tasks and projects:', error)
    }
  }

  fetchData()
}, [])

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

 async function handleCreateTask(task) {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create task')
    }

    const project = projects.find(
      (project) => project.id === data.projectId
    )

    const taskWithProject = {
      ...data,
      project: project?.name || 'Unknown project',
    }

    setTasks((currentTasks) => [...currentTasks, taskWithProject])
    setShowForm(false)
  } catch (error) {
    console.error('Error creating task:', error)
    alert(error.message)
  }
}

async function handleEditTask(updatedTask) {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${updatedTask.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          projectId: updatedTask.projectId,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update task')
    }

    const project = projects.find(
      (project) => project.id === data.projectId
    )

    const taskWithProject = {
      ...data,
      project: project?.name || 'Unknown project',
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskWithProject.id ? taskWithProject : task
      )
    )

    setEditingTask(null)
    setSelectedTask(null)
  } catch (error) {
    console.error('Error updating task:', error)
    alert(error.message)
  }
}
async function handleDeleteTask(taskId) {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete task')
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    )

    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }

    if (editingTask?.id === taskId) {
      setEditingTask(null)
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    alert(error.message)
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
              projects={projects}
            onClose={() => setShowForm(false)}
            onCreate={handleCreateTask}
          />
        </div>
      )}

  {selectedTask && (
  <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Task Details
    </h2>

    <div className="mt-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Task Title
        </p>
        <p className="mt-1 text-gray-900">
          {selectedTask.title || 'Not provided'}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">
          Project
        </p>
        <p className="mt-1 text-gray-900">
          {selectedTask.project || 'Not provided'}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">
          Status
        </p>
        <p className="mt-1 text-gray-900">
          {selectedTask.status || 'Not provided'}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">
          Description
        </p>
        <p className="mt-1 whitespace-pre-wrap text-gray-900">
          {selectedTask.description || 'No description provided'}
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => setSelectedTask(null)}
      className="mt-6 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Close
    </button>
  </div>
)}

      {editingTask && (
        <TaskEditForm
          task={editingTask}
          projects={projects}
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