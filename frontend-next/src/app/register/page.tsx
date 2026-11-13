'use client'

// React hooks and event types. (RESTORED MISSING IMPORTS)
import { useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'

// Next.js navigation.
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Expected structure of a successful or failed registration response.
type RegisterResponse = {
  token?: string 
  message?: string
}

// Check that the server response has the expected structure.
function isRegisterResponse(data: unknown): data is RegisterResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const response = data as Record<string, unknown>

  return (
    (response.token === undefined || typeof response.token === 'string') &&
    (response.message === undefined || typeof response.message === 'string')
  )
}

export default function RegisterPage() {
  const router = useRouter()

  // Form input values.
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // Form status.
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handle username input changes.
  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>): void {
    setUsername(event.target.value)
  }

  // Handle email input changes.
  function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value)
  }

  // Handle password input changes.
  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
  }

  // Handle form submission.
  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      )

      // Treat the server response as unknown until we validate it.
      const data: unknown = await response.json()

      if (!isRegisterResponse(data)) {
        setError('Something went wrong on our end. Please try again.')
        return
      }

      // Handle unsuccessful registration.
      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      // FIXED: Strictly confirm the token exists as a string before saving it
      if (typeof data.token !== 'string' || data.token.length === 0) {
  setError('Account created, but automatic sign-in failed. Please log in.')
  return
}

      // Save the authentication token securely.
      localStorage.setItem('token', data.token)

      // Show success message.
      setSuccess('Account created successfully!')

      // Redirect to Dashboard.
      window.setTimeout(() => {
        router.replace('/')
      }, 1000)

      } catch {
  setError(
    'We couldn’t complete your registration. Please check your connection and try again.'
  )
}
finally {
      setIsLoading(false)
    }
  }

  return (
   <section className="flex min-h-screen items-start justify-center bg-gray-50 px-4 pt-8 sm:items-center sm:pt-0">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-600">
            Create your ClientFlow account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Display registration errors. */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Display registration success messages. */}
          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          {/* Username field. */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Email field. */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Password field. */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Submit button. */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* FIXED: Moved registration navigation link cleanly outside the form container */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}
