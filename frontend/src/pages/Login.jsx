import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Added useNavigate

function Login() {
  const navigate = useNavigate() // Initialized the navigate hook
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
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

      const data = await response.json()

      console.log('Login response:', data)

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)

      setSuccess('Login successful!')
      
      // Optional: Save token if your backend returns one
      // localStorage.setItem('token', data.token)

      // Redirect the user to the dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard') 
      }, 1000)

    } catch (error) {
      setError('Could not connect to the server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600">
            Log in to your ClientFlow account.
          </p>
        </div>

        {/* Form Opens Here */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-gray-700"
            >
              username
            </label>

           <input
  id="login-username"
  type="text"
  value={username}
  onChange={(event) => setUsername(event.target.value)}
  required
  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
/>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form> {/* FIXED: Added missing closing form tag */}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div> {/* FIXED: Mismatched tag corrected */}
    </section>
  )
}

export default Login
