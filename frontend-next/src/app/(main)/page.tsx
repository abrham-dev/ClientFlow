'use client'

// React hooks.
import { useCallback, useEffect, useState } from 'react'

// Dashboard components.
import StatCard from '@/components/StatCard'
import ProjectRow from '@/components/ProjectRow'
import TaskRow from '@/components/TaskRow'

// Define the structure of a client returned by the API.
type Client = {
  id: number
  name: string
}

// Define the structure of a project returned by the API.
type Project = {
  id: number
  name: string
  clientId: number
  status: string
  createdAt: string
}

// Define the structure of a task returned by the API.
type Task = {
  id: number
  title: string
  projectId: number
  status: string
  createdAt: string
}

function Dashboard() {
  // Store dashboard data.
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  // Store loading and error states.
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Fetch dashboard data from the backend.
  const fetchDashboardData = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      // Retrieve the authentication token from localStorage.
      const token = localStorage.getItem('token')

      if (!token) {
        setError('You must log in to view the dashboard.')
        return
      }

      // Check that the backend API URL is configured.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      if (!apiUrl) {
        throw new Error('Backend API URL is not configured.')
      }

      // Include the JWT token in requests to protected endpoints.
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      // Fetch clients, projects, and tasks at the same time.
      const [clientsResponse, projectsResponse, tasksResponse] =
        await Promise.all([
          fetch(`${apiUrl}/api/clients`, { headers }),
          fetch(`${apiUrl}/api/projects`, { headers }),
          fetch(`${apiUrl}/api/tasks`, { headers }),
        ])

      // Stop if any request was unsuccessful.
      if (
        !clientsResponse.ok ||
        !projectsResponse.ok ||
        !tasksResponse.ok
      ) {
        throw new Error('Failed to load dashboard data.')
      }

      // Read the API responses using their expected TypeScript types.
      const [clientsData, projectsData, tasksData] = await Promise.all([
        clientsResponse.json() as Promise<Client[]>,
        projectsResponse.json() as Promise<Project[]>,
        tasksResponse.json() as Promise<Task[]>,
      ])

      // Update dashboard data.
      setClients(clientsData)
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (error: unknown) {
      // Log the actual error for debugging.
      console.error('Failed to load dashboard data:', error)

      // Display a user-friendly error message.
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      // Stop the loading state whether the request succeeds or fails.
      setLoading(false)
    }
  }, [])

  // Fetch dashboard data when the page first loads.
  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])

  // Display a loading message while fetching data.
  if (loading) {
    return (
      <p className="p-6 text-gray-600">
        Loading dashboard data...
      </p>
    )
  }

  // Display an error message and retry button if fetching fails.
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => void fetchDashboardData()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Calculate the number of active projects.
  const activeProjects = projects.filter(
    (project) => project.status.toLowerCase() === 'active'
  ).length

  // Calculate the number of open tasks.
  const openTasks = tasks.filter(
    (task) => task.status !== 'Completed'
  ).length

  // Calculate the number of completed tasks.
  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  // Sort projects by creation date and select the three newest.
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3)

  // Sort tasks by creation date and select the three newest.
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3)

  return (
    <section>
      {/* Dashboard heading. */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to ClientFlow.
        </p>
      </div>

      {/* Display the dashboard statistics. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
        />

        <StatCard
          title="Open Tasks"
          value={openTasks}
        />

        <StatCard
          title="Completed Tasks"
          value={completedTasks}
        />
      </div>

      {/* Display the three most recently created projects. */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your most recently created projects.
          </p>
        </div>

        <div className="px-5">
          {recentProjects.length === 0 ? (
            <p className="py-5 text-sm text-gray-500">
              No projects yet.
            </p>
          ) : (
            recentProjects.map((project) => {
              // Find the client associated with this project.
              const client = clients.find(
                (client) => client.id === project.clientId
              )

              return (
                <ProjectRow
                  key={project.id}
                  name={project.name}
                  client={client?.name || 'Unknown client'}
                  status={project.status}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Display the three most recently created tasks. */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your most recently created tasks.
          </p>
        </div>

        <div className="px-5">
          {recentTasks.length === 0 ? (
            <p className="py-5 text-sm text-gray-500">
              No tasks yet.
            </p>
          ) : (
            recentTasks.map((task) => {
              // Find the project associated with this task.
              const project = projects.find(
                (project) => project.id === task.projectId
              )

              return (
                <TaskRow
                  key={task.id}
                  title={task.title}
                  project={project?.name || 'Unknown project'}
                  status={task.status}
                />
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
