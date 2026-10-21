import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ProjectRow from '../components/ProjectRow'
import TaskRow from '../components/TaskRow'

function Dashboard() {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('')

  async function fetchDashboardData() {
  setLoading(true)
  setError('')

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('You must log in to view the dashboard.')
      return
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const [clientsResponse, projectsResponse, tasksResponse] =
      await Promise.all([
        fetch('http://localhost:5000/api/clients', { headers }),
        fetch('http://localhost:5000/api/projects', { headers }),
        fetch('http://localhost:5000/api/tasks', { headers }),
      ])

    const [clientsData, projectsData, tasksData] = await Promise.all([
      clientsResponse.json(),
      projectsResponse.json(),
      tasksResponse.json(),
    ])

    if (
      !clientsResponse.ok ||
      !projectsResponse.ok ||
      !tasksResponse.ok
    ) {
      throw new Error('Failed to load dashboard data.')
    }

    setClients(clientsData)
    setProjects(projectsData)
    setTasks(tasksData)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    setError('Failed to load dashboard data. Please try again.')
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchDashboardData()
}, [])

if (loading) {
  return (
    <p className="p-6 text-gray-600">
      Loading dashboard data...
    </p>
  )
}

if (error) {
  return (
    <div className="p-6">
      <p className="text-red-600">{error}</p>

      <button
        onClick={fetchDashboardData}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  )
}

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to ClientFlow.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
  title="Total Clients"
  value={clients.length}
/>

<StatCard
  title="Active Projects"
  value={
    projects.filter(
      (project) => project.status.toLowerCase() === 'active'
    ).length
  }
/>

<StatCard
  title="Open Tasks"
  value={
    tasks.filter((task) => task.status !== 'Completed').length
  }
/>

<StatCard
  title="Completed Tasks"
  value={
    tasks.filter((task) => task.status === 'Completed').length
  }
/>
      </div>


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
  {projects.length === 0 ? (
    <p className="py-5 text-sm text-gray-500">
      No projects yet.
    </p>
  ) : (
    [...projects]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 3)
      .map((project) => {
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
  {tasks.length === 0 ? (
    <p className="py-5 text-sm text-gray-500">
      No tasks yet.
    </p>
  ) : (
    [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 3)
      .map((task) => {
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