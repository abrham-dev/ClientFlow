import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import ProjectEditForm from '../components/ProjectEditForm'

function Projects() {
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corporation',
      status: 'In Progress',
    },

    {
      id: 2,
      name: 'Mobile App',
      client: 'Bright Solutions',
      status: 'Planning',
    },

    {
      id: 3,
      name: 'E-commerce Store',
      client: 'Nova Studio',
      status: 'Completed',
    },

    {
      id: 4,
      name: 'website design',
      client: "Abrsh Software",
      status: "planning"
    },

    {
      id: 5,
      name: 'Saas',
      client: "Abrsh Software",
      status: "completed"
    },

    {
      id: 6,
      name: 'website design',
      client: "Ethio Telecom",
      status: "planning"
    }
  ])

  const filteredProjects = projects.filter((project) =>
  project.name.toLowerCase().includes(searchTerm.toLowerCase())
)

  function handleCreateProject(project) {
    setProjects([...projects, project])
    setShowForm(false)
  }

  function handleEditProject(updatedProject) {
  setProjects(
    projects.map((project) =>
      project.id === updatedProject.id
        ? updatedProject
        : project
    )
  )

  setEditingProject(null)
}

function handleDeleteProject(projectId) {
  setProjects(
    projects.filter((project) => project.id !== projectId)
  )

  if (selectedProject?.id === projectId) {
    setSelectedProject(null)
  }

  if (editingProject?.id === projectId) {
    setEditingProject(null)
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
      {selectedProject.name}
    </h2>

    <p className="mt-2 text-gray-600">
      Client: {selectedProject.client}
    </p>

    <p className="mt-1 text-gray-600">
      Status: {selectedProject.status}
    </p>

    <button
      type="button"
      onClick={() => setSelectedProject(null)}
      className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Close
    </button>
  </div>
)}

      {showForm && (
        <div className="mt-8">
          <ProjectForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateProject}
          />
        </div>
      )}
      
{editingProject && (
  <ProjectEditForm
    project={editingProject}
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