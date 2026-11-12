'use client'

import { useState, type ChangeEvent, type SyntheticEvent } from 'react'

// Define the information needed to create a client.
type NewClient = {
  name: string
  email: string
  company: string
}

// Define the functions this component receives from its parent.
type ClientFormProps = {
  onClose: () => void
  onCreate: (client: NewClient) => void
}

function ClientForm({ onClose, onCreate }: ClientFormProps) {
  // Store the information entered by the user.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Add Client
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the client's information.
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

      <form
        onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
          event.preventDefault()

          onCreate({
            name,
            email,
            company,
          })
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <input
            required
            id="name"
            type="text"
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
            placeholder="John Smith"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            required
            id="email"
            type="email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
            placeholder="john@example.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>

          <input
            required
            id="company"
            type="text"
            value={company}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setCompany(event.target.value)
            }
            placeholder="Acme Corporation"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Create Client
        </button>
      </form>
    </div>
  )
}

export default ClientForm