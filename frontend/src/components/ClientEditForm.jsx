import { useState } from 'react'

function ClientEditForm({ client, onClose, onSave }) {
  const [name, setName] = useState(client.name)
  const [email, setEmail] = useState(client.email)
  const [company, setCompany] = useState(client.company)


  function handleSubmit(event) {
    event.preventDefault()

    onSave({
      ...client,
      name,
      email,
      company,
    })
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Client
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the client's information.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="edit-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <input
          required
            id="edit-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
          required
            id="edit-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>

          <input
          required
            id="edit-company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ClientEditForm