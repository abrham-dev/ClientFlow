'use client'

import { useCallback, useEffect, useState } from 'react'
import ClientCard from '@/components/ClientCard'
import ClientForm from '@/components/ClientForm'
import ClientEditForm from '@/components/ClientEditForm'

// Define the structure of a client.
type Client = {
  id: number
  name: string
  email: string
  company: string
}

// Define the information required to create a client.
type NewClient = {
  name: string
  email: string
  company: string
}

// Define the possible error response from the backend.
type ApiError = {
  message?: string
}

function Clients() {
  // Control whether the create form is visible.
  const [showForm, setShowForm] = useState(false)

  // Store the client currently selected for viewing.
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Store the client currently selected for editing.
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  // Store the search input.
  const [searchTerm, setSearchTerm] = useState('')

  // Store all clients fetched from the backend.
  const [clients, setClients] = useState<Client[]>([])

  // Track loading and error states.
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Get the backend API URL from the environment variable.
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch all clients from the backend.
  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

      if (!API_URL) {
        throw new Error('Our servers are currently undergoing maintenance. Please try again later.')
      }

      const response = await fetch(`${API_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('We could not load your client list. Please refresh the page or check your connection.')
      }

      const data = (await response.json()) as Client[]

      setClients(data)
    } catch (error: unknown) {
      console.error('Error fetching clients:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to your client list right now. If this keeps happening, please contact support.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  // Fetch clients when the page first loads.
  useEffect(() => {
    void fetchClients()
  }, [fetchClients])

  // Filter clients according to the search input.
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create a new client.
  async function handleCreateClient(client: NewClient) {
    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
       throw new Error('Something went wrong with your login details. Please refresh the page or try logging in again.')
      }

      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(client),
      })

      const data = (await response.json()) as Client & ApiError

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create client.')
      }

      // Add the newly created client to the list.
      setClients((previousClients) => [...previousClients, data])

      setShowForm(false)
    } catch (error: unknown) {
      console.error('Error creating client:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create client. Please try again.'
      )
    }
  }

  // Update an existing client.
  async function handleEditClient(updatedClient: Client) {
    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
      throw new Error('Your login session has expired. Please log in again to save your changes.')
      }

      const response = await fetch(
        `${API_URL}/api/clients/${updatedClient.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedClient),
        }
      )

      const savedClient = (await response.json()) as Client & ApiError

      if (!response.ok) {
        throw new Error(savedClient.message || 'Failed to update client.')
      }

      // Replace the old client with the updated client.
      setClients((previousClients) =>
        previousClients.map((client) =>
          client.id === savedClient.id ? savedClient : client
        )
      )

      setEditingClient(null)

      // Update the selected client if it is currently being viewed.
      setSelectedClient((previousClient) =>
        previousClient?.id === savedClient.id ? savedClient : previousClient
      )
    } catch (error: unknown) {
      console.error('Error updating client:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to edit client. Please try again.'
      )
    }
  }

  // Delete a client and its associated projects and tasks.
  async function handleDeleteClient(clientId: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this client?\n\n' +
        'All projects and tasks associated with this client will also be permanently deleted.\n\n' +
        'This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')

      if (!token || !API_URL) {
       throw new Error('Your login session has expired. Please sign back in to delete this client.')
      }

      const response = await fetch(`${API_URL}/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = (await response.json()) as ApiError

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete client.')
      }

      // Remove the deleted client from the list.
      setClients((previousClients) =>
        previousClients.filter((client) => client.id !== clientId)
      )

      // Close the details view if the deleted client was selected.
      if (selectedClient?.id === clientId) {
        setSelectedClient(null)
      }

      // Close the editing form if the deleted client was being edited.
      if (editingClient?.id === clientId) {
        setEditingClient(null)
      }
    } catch (error: unknown) {
      console.error('Error deleting client:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete client. Please try again.'
      )
    }
  }

  return (
    <section>
      {/* Page heading and Add Client button. */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your clients and their projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((previous) => !previous)}
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          {showForm ? 'Close Form' : 'Add Client'}
        </button>
      </div>

      {/* Display the client creation form when requested. */}
      {showForm && (
        <ClientForm
          onClose={() => setShowForm(false)}
          onCreate={handleCreateClient}
        />
      )}

      {/* Display details of the selected client. */}
      {selectedClient && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Client Details
            </h2>

            <button
              type="button"
              onClick={() => setSelectedClient(null)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              <strong>Name:</strong> {selectedClient.name}
            </p>

            <p>
              <strong>Company:</strong>{' '}
              {selectedClient.company || 'Not provided'}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {selectedClient.email || 'Not provided'}
            </p>
          </div>
        </div>
      )}

      {/* Display the client editing form when a client is selected for editing. */}
      {editingClient && (
        <ClientEditForm
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleEditClient}
        />
      )}

      {/* Search clients by name. */}
      <div className="mt-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search clients by name..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
        />
      </div>

      {/* Display loading, error, empty, or client list states. */}
      {isLoading ? (
        <p className="mt-8 text-center text-gray-500">
          Loading clients...
        </p>
      ) : error ? (
        <div className="mt-8 text-center">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void fetchClients()}
            className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      ) : clients.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No clients yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add your first client to get started.
          </p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No clients found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching for a different client.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              email={client.email}
              company={client.company}
              onView={() => setSelectedClient(client)}
              onEdit={() => setEditingClient(client)}
              onDelete={() => void handleDeleteClient(client.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Clients