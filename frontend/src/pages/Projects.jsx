import { useState, useEffect} from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import ProjectEditForm from '../components/ProjectEditForm'


function Projects() {
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
 const [projects, setProjects] = useState([])
 const [clients, setClients] = useState([])

 
 useEffect(() => {
  async function fetchData() {
    try {
      const token = localStorage.getItem('token')

      const [projectsResponse, clientsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:5000/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      if (!projectsResponse.ok || !clientsResponse.ok) {
        throw new Error('Failed to fetch projects or clients')
      }

      const projectsData = await projectsResponse.json()
      const clientsData = await clientsResponse.json()

      setClients(clientsData)

      const projectsWithClientNames = projectsData.map((project) => {
        const client = clientsData.find(
          (client) => Number(client.id) === Number(project.clientId)
        )

        return {
          ...project,
          client: client ? client.name : 'Unknown client',
        }
      })

      setProjects(projectsWithClientNames)
    } catch (error) {
      console.error('Error fetching projects and clients:', error)
    }
  }

  fetchData()
}, [])

  const filteredProjects = projects.filter((project) =>
  project.name.toLowerCase().includes(searchTerm.toLowerCase())
)

async function handleCreateProject(project) {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create project')
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
  } catch (error) {
    console.error('Error creating project:', error)
    alert(error.message)
  }
}

 async function handleEditProject(updatedProject) {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `http://localhost:5000/api/projects/${updatedProject.id}`,
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update project')
    }

    const selectedClient = clients.find(
      (client) => Number(client.id) === Number(data.clientId)
    )

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === data.id
          ? {
              ...data,
              client: selectedClient
                ? selectedClient.name
                : 'Unknown client',
            }
          : project
      )
    )

    setEditingProject(null)
  } catch (error) {
    console.error('Error updating project:', error)
    alert(error.message)
  }
}

async function handleDeleteProject(projectId) {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `http://localhost:5000/api/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete project')
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
  } catch (error) {
    console.error('Error deleting project:', error)
    alert(error.message)
  }
}

  return (
    <section>
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
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Add Project
        </button>
      </div>

  {selectedProject && (
  <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Project Details
    </h2>

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

    <button
      type="button"
      onClick={() => setSelectedProject(null)}
      className="mt-6 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Close
    </button>
  </div>
)}

      {showForm && (
        <div className="mt-8">
          <ProjectForm
            clients={clients}
            onClose={() => setShowForm(false)}
            onCreate={handleCreateProject}
          />
        </div>
      )}
      
{editingProject && (
  <ProjectEditForm
    project={editingProject}
    clients={clients}
    onClose={() => setEditingProject(null)}
    onSave={handleEditProject}
  />
)}

<div className="mt-8">
  <input
    type="text"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    placeholder="Search projects..."
    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-gray-500"
  />
</div>

<div className="mt-8">
  {projects.length === 0 ? (
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
          onDelete={() => handleDeleteProject(project.id)}
        />
      ))}
    </div>
  )}
</div>
    
    </section>
  )
}

export default Projects