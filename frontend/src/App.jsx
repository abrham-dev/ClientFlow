import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="*"
            element={
       <div className="flex h-screen overflow-hidden bg-gray-50">
                <Sidebar/>

              <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App