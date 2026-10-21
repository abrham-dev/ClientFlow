import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {

 const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
<aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        ClientFlow
      </h2>

      <nav className="mt-8 flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-900'
              : 'rounded-lg px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive
              ? 'rounded-lg bg-gray-100 px-4 py-2 text-gray-900'
              : 'rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        >
          Clients
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive
              ? 'rounded-lg bg-gray-100 px-4 py-2 text-gray-900'
              : 'rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive
              ? 'rounded-lg bg-gray-100 px-4 py-2 text-gray-900'
              : 'rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        >
          Tasks
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-gray-200 pt-6">
        <p className="mb-2 text-sm font-semibold text-gray-500">
          Account
        </p>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? 'block rounded-lg bg-gray-100 px-4 py-2 text-gray-900'
              : 'block rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        >
          Profile
        </NavLink>

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