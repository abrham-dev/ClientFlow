import { useState } from 'react'
import ClientCard from '../components/ClientCard'
import ClientForm from '../components/ClientForm'
import ClientEditForm from '../components/ClientEditForm'

function Clients() {
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      company: 'Acme Corporation',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      company: 'Bright Solutions',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      company: 'Nova Studio',
    },
    {
      id: 4,
      name: "Ali alamudi",
      email: "aliamaudi@gmail.com",
      company: "Medroc Investment group"
    },
    {
     id: 5,
     name: "Ethiopian Airline",
     email: "ethiopianairline.com",
     company: "Ethiopian Airline investment group"
    },
    {
      id: 6,
      name: "Getachew Melese",
      email: "sweatBox.com",
      company: "sweat Box"
    }
  ])

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleCreateClient(client) {
    setClients([...clients, client])
    setShowForm(false)
  }

  function handleEditClient(updatedClient) {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    )

    setEditingClient(null)
  }

  function handleDeleteClient(clientId) {
    setClients(
      clients.filter((client) => client.id !== clientId)
    )

    if (selectedClient?.id === clientId) {
      setSelectedClient(null)
    }

    if (editingClient?.id === clientId) {
      setEditingClient(null)
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
            {selectedClient.name}
          </h2>

          <p className="mt-2 text-gray-600">
            {selectedClient.email}
          </p>

          <p className="mt-1 text-gray-600">
            {selectedClient.company}
          </p>

          <button
            type="button"
            onClick={() => setSelectedClient(null)}
            className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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