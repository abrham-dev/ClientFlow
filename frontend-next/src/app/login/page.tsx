'use client'

// React hooks and event types.
import { useState } from 'react'
import type { ChangeEvent,SyntheticEvent } from 'react'

// Next.js navigation.
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define the possible shape of a successful or failed login response.
type LoginResponse = {
  token?: string
  message?: string
}

// Check whether an unknown value is a valid object.
function isLoginResponse(data: unknown): data is LoginResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const response = data as Record<string, unknown>

  return (
    (response.token === undefined || typeof response.token === 'string') &&
    (response.message === undefined || typeof response.message === 'string')
  )
}

export default function LoginPage() {
  const router = useRouter()

  // Form input states.
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // UI states.
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handle changes in the username input.
  function handleUsernameChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setUsername(event.target.value)
  }

  // Handle changes in the password input.
  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setPassword(event.target.value)
  }

  // Handle login form submission.
 async function handleSubmit(
  event: SyntheticEvent<HTMLFormElement>
): Promise<void> {
    event.preventDefault()

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Send login credentials to the Express backend.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      // Read the response as unknown because backend data
      // should not be trusted until its structure is checked.
      const data: unknown = await response.json()

    // 1. Validate the response structure.
if (!isLoginResponse(data)) {
  setError('Something went wrong on our end. Please try logging in again.')
  return
}

// 2. Handle unsuccessful login attempts.
if (!response.ok) {
  setError(data.message || 'Login failed. Please check your credentials.')
  return
}

// 3. A successful login must include an authentication token.
if (!data.token) {
  setError('We could not securely sign you in. Please try again or contact support.')
  return
}


      // Save the JWT token in browser local storage.
      localStorage.setItem('token', data.token)

      setUsername('')
      setPassword('')

      setSuccess('Login successful!')

      // Redirect the user to the Dashboard.
      window.setTimeout(() => {
        router.replace('/')
      }, 1000)

    } catch (error: unknown) {
      // Handle network errors and unexpected exceptions.
      if (error instanceof Error) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      // Stop the loading indicator after the request finishes.
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6">

        {/* Login heading */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600">
            Log in to your ClientFlow account.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Error message */}
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Success message */}
          {success && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* Username field */}
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="login-username"
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

          {/* Password field */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Registration link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}

          <Link
            href="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </section>
  )
}