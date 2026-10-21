import { useEffect, useState } from 'react'

function Profile() {

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [currentPassword, setCurrentPassword] = useState('')
const [password, setPassword] = useState('')
const [message, setMessage] = useState('')
const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setError('You are not logged in.')
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json();

       if (!response.ok) {
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    return
  }

  setError(data.message || 'Failed to load profile.')
  return
}

        setUser(data)
setUsername(data.username || '')
setEmail(data.email || '')
      } catch {
        setError('Could not connect to the server.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  async function handleSaveProfile(event) {
  event.preventDefault()

  setError('')
  setMessage('')
  setIsSaving(true)

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('You are not logged in.')
      return
    }

    const updatedData = {
      username: username.trim(),
      email: email.trim() || null,
    }

    if (password) {
      updatedData.currentPassword = currentPassword
      updatedData.password = password
    }

    const response = await fetch(
      'http://localhost:5000/api/users/me',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Failed to update profile.')
      return
    }

    setUser(data)
    setUsername(data.username || '')
    setEmail(data.email || '')
    setCurrentPassword('')
    setPassword('')
    setMessage('Profile updated successfully.')
  } catch {
    setError('Could not connect to the server.')
  } finally {
    setIsSaving(false)
  }
}

  if (isLoading) {
    return <p>Loading profile...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

    return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">
        Profile
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your account information.
      </p>

      <form
        onSubmit={handleSaveProfile}
        className="mt-8 max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Account Information
        </h2>

        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email (optional)
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Change Password
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Leave both password fields empty if you do not want to change your password.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-green-700" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}
export default Profile;