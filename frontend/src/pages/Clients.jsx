import { useEffect, useState } from 'react'
import ClientCard from '../components/ClientCard'
import ClientForm from '../components/ClientForm'
import ClientEditForm from '../components/ClientEditForm'

function Clients() {
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState([])

  useEffect(() => {
  async function fetchClients() {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  fetchClients()
}, [])

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

async function handleCreateClient(client) {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(client),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create client')
    }

    setClients([...clients, data])
    setShowForm(false)
  } catch (error) {
    console.error('Error creating client:', error)
    alert(('Failed to create project. Please try again.'))
  }
}

  async function handleEditClient(updatedClient) {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
     `${import.meta.env.VITE_API_URL}/api/clients/${updatedClient.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedClient),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update client')
    }

    const savedClient = await response.json()

    setClients(
      clients.map((client) =>
        client.id === savedClient.id ? savedClient : client
      )
    )

    setEditingClient(null)
  } catch (error) {
    console.error('Error updating client:', error)
 alert(('Failed to edit project. Please try again.'))
  }
}

async function handleDeleteClient(clientId) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this client?\n\nAll projects and tasks associated with this client will also be permanently deleted.\n\nThis action cannot be undone.'
  )

  if (!confirmed) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${clientId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

      const data = await response.json();
   if (!response.ok) {
  throw new Error(data.message || 'Failed to delete client')
}

    setClients(
      clients.filter((client) => client.id !== clientId)
    )

    if (selectedClient?.id === clientId) {
      setSelectedClient(null)
    }

    if (editingClient?.id === clientId) {
      setEditingClient(null)
    }
  } catch (error) {
    console.error('Error deleting client:', error)
    alert('Failed to delete client. Please try again.')
  }
}


  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Clients
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your clients and their projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Add Client
        </button>
      </div>

      {showForm && (
        <div className="mt-8">
          <ClientForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateClient}
          />
        </div>
      )}

  {selectedClient && (
  <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Client Details
    </h2>

    <div className="mt-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Name
        </p>
        <p className="mt-1 text-gray-900">
          {selectedClient.name || 'Not provided'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">
          Company
        </p>
        <p className="mt-1 text-gray-900">
          {selectedClient.company || 'Not provided'}
        </p>
      </div>


      <div>
        <p className="text-sm font-medium text-gray-500">
          Email
        </p>
        <p className="mt-1 text-gray-900">
          {selectedClient.email || 'Not provided'}
        </p>
      </div>

    </div>

    <button
      type="button"
      onClick={() => setSelectedClient(null)}
      className="mt-6 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Close
    </button>
  </div>
)}

      {editingClient && (
        <ClientEditForm
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleEditClient}
        />
      )}

      <div className="mt-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search clients..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-gray-500"
        />
      </div>
<div className="mt-8">
  {clients.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        No clients yet
      </h2>

      <p className="mt-2 text-gray-500">
        Add your first client to get started.
      </p>
    </div>
  ) : filteredClients.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        No clients found
      </h2>

      <p className="mt-2 text-gray-500">
        Try searching for a different client.
      </p>
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filteredClients.map((client) => (
        <ClientCard
          key={client.id}
          name={client.name}
          email={client.email}
          company={client.company}
          onView={() => {
            setEditingClient(null)
            setSelectedClient(client)
          }}
          onEdit={() => {
            setSelectedClient(null)
            setEditingClient(client)
          }}
          onDelete={() => handleDeleteClient(client.id)}
        />
      ))}
    </div>
  )}
</div>

    </section>
  )
}

export default Clients