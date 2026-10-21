import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
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
      'http://localhost:5000/api/auth/register',
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

    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Registration failed')
      return
    }

    setSuccess(data.message)

setTimeout(() => {
  navigate('/login')
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
            Create Account
          </h1>

          <p className="mt-2 text-gray-600">
            Create your ClientFlow account.
          </p>
        </div>

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
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
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
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
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
  {isLoading ? 'Creating account...' : 'Create Account'}
</button>
          
         <p className="mt-6 text-center text-sm text-gray-600">
  Already have an account?{' '}
  <Link
    to="/login"
    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
  >
    Log in
  </Link>
</p>
        </form>
      </div>
    </section>
  )
}

export default Register