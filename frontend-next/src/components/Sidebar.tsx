'use client'

// Link lets us navigate between Next.js pages.
// usePathname tells us which page the user is currently viewing.
// useRouter lets us navigate programmatically, such as after logout.
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  // Remove the saved login token and redirect the user to the login page.
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('lastActivity')
    router.replace('/login')
  }

  // Reuse the same styling for every navigation link.
  // If the link matches the current page, highlight it.
  // "block" makes the link occupy the available row width.
  const linkClass = (path: string) =>
    pathname === path
      ? 'block rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-900'
      : 'block rounded-lg px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6">
      {/* Application name */}
      <h2 className="text-2xl font-bold text-gray-900">
        ClientFlow
      </h2>

      {/* Main navigation links */}
      <nav className="mt-8 flex flex-col gap-2">
        <Link href="/" className={linkClass('/')}>
          Dashboard
        </Link>

        <Link href="/clients" className={linkClass('/clients')}>
          Clients
        </Link>

        <Link href="/projects" className={linkClass('/projects')}>
          Projects
        </Link>

        <Link href="/tasks" className={linkClass('/tasks')}>
          Tasks
        </Link>
      </nav>

      {/* Account links and logout button */}
      <div className="mt-auto border-t border-gray-200 pt-6">
        <p className="mb-2 text-sm font-semibold text-gray-500">
          Account
        </p>

        <Link href="/profile" className={linkClass('/profile')}>
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 block w-full rounded-lg px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar