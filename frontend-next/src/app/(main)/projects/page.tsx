'use client'

import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import ProjectCard from '@/components/projectCard'
import ProjectForm from '@/components/projectForm'
import ProjectEditForm from '@/components/ProjectEditForm'

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
  createdAt?: string
  client: string
}

// Define the information needed to create a project.
type NewProject = {
  name: string
  description: string
  status: string
  clientId: number
}

// Define a possible error response from the backend.
type ApiError = {
  message?: string
}

function Projects() {
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch projects and clients from the backend.
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

     if (!API_URL) {
  throw new Error('We are having trouble connecting to our servers right now. Please refresh the page or try again in a few minutes.')
}

      const [projectsResponse, clientsResponse] = await Promise.all([
        fetch(`${API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      if (!projectsResponse.ok || !clientsResponse.ok) {
  throw new Error('We ran into a small hiccup loading your dashboard. Please give the page a quick refresh or try again in a moment.')
}

      const projectsData = (await projectsResponse.json()) as Omit<
        Project,
        'client'
      >[]

      const clientsData = (await clientsResponse.json()) as Client[]

      setClients(clientsData)

      const projectsWithClientNames: Project[] = projectsData.map(
        (project) => {
          const client = clientsData.find(
            (client) => client.id === project.clientId
          )

          return {
            ...project,
            client: client ? client.name : 'Unknown client',
          }
        }
      )

      setProjects(projectsWithClientNames)
    } catch (error: unknown) {
      console.error('Error fetching projects and clients:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while fetching projects.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  // Filter projects by name.
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create a new project.
  async function handleCreateProject(project: NewProject) {
    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
        throw new Error('Your login session has expired. Please sign back in to create this project.')
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      })

      const data = (await response.json()) as Omit<Project, 'client'> &
        ApiError

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project.')
      }

      const selectedClient = clients.find(
        (client) => client.id === data.clientId
      )

      setProjects((currentProjects) => [
        ...currentProjects,
        {
          ...data,
          client: selectedClient ? selectedClient.name : 'Unknown client',
        },
      ])

      setShowForm(false)
    } catch (error: unknown) {
      console.error('Error creating project:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create project. Please try again.'
      )
    }
  }

  // Update an existing project.
 async function handleEditProject(
  updatedProject: Omit<Project, 'client'>
) {
    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
        throw new Error('Your login session has expired. Please sign back in to create your project.')
      }

      const response = await fetch(
        `${API_URL}/api/projects/${updatedProject.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: updatedProject.name,
            description: updatedProject.description,
            status: updatedProject.status,
            clientId: updatedProject.clientId,
          }),
        }
      )

      const data = (await response.json()) as Omit<Project, 'client'> &
        ApiError

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project.')
      }

      const selectedClient = clients.find(
        (client) => client.id === data.clientId
      )

      const savedProject: Project = {
        ...data,
        client: selectedClient ? selectedClient.name : 'Unknown client',
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === savedProject.id ? savedProject : project
        )
      )

      setSelectedProject((currentProject) =>
        currentProject?.id === savedProject.id
          ? savedProject
          : currentProject
      )

      setEditingProject(null)
    } catch (error: unknown) {
      console.error('Error updating project:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to edit project. Please try again.'
      )
    }
  }

  // Delete a project and its associated tasks.
  async function handleDeleteProject(projectId: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?\n\n' +
        'All tasks associated with this project will also be permanently deleted.\n\n' +
        'This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
      throw new Error('We could not verify your secure connection. Please refresh the page or try logging in again.')
      }

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = (await response.json()) as ApiError

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete project.')
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      )

      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }

      if (editingProject?.id === projectId) {
        setEditingProject(null)
      }
    } catch (error: unknown) {
      console.error('Error deleting project:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete project. Please try again.'
      )
    }
  }

  return (
    <section>
      {/* Page heading and Add Project button. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your projects and track their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((previous) => !previous)}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          {showForm ? 'Close Form' : 'Add Project'}
        </button>
      </div>

      {/* Display the project creation form. */}
      {showForm && (
        <div className="mt-8">
          <ProjectForm
            clients={clients}
            onClose={() => setShowForm(false)}
            onCreate={handleCreateProject}
          />
        </div>
      )}

      {/* Display the selected project's details. */}
      {selectedProject && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Project Details
            </h2>

            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Project Name
              </p>
              <p className="mt-1 text-gray-900">
                {selectedProject.name || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Client
              </p>
              <p className="mt-1 text-gray-900">
                {selectedProject.client || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Status
              </p>
              <p className="mt-1 text-gray-900">
                {selectedProject.status || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Description
              </p>
              <p className="mt-1 whitespace-pre-wrap text-gray-900">
                {selectedProject.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Display the project editing form. */}
      {editingProject && (
        <ProjectEditForm
          project={editingProject}
          clients={clients}
          onClose={() => setEditingProject(null)}
          onSave={handleEditProject}
        />
      )}

      {/* Search projects by name. */}
      <div className="mt-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search projects..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-gray-500"
        />
      </div>

      {/* Display loading, error, empty, or project list states. */}
      <div className="mt-8">
        {isLoading ? (
          <p className="py-10 text-center text-gray-500">
            Loading projects...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void fetchData()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No projects yet
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first project to get started.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No projects found
            </h2>

            <p className="mt-2 text-gray-500">
              Try searching for a different project.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                client={project.client}
                status={project.status}
                onView={() => {
                  setEditingProject(null)
                  setSelectedProject(project)
                }}
                onEdit={() => {
                  setSelectedProject(null)
                  setEditingProject(project)
                }}
                onDelete={() => void handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects