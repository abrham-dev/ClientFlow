import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const INACTIVITY_LIMIT = 10 * 60 * 1000

function ProtectedRoute() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return

    const lastActivity = localStorage.getItem('lastActivity')
    const now = Date.now()

    if (
      lastActivity &&
      now - Number(lastActivity) >= INACTIVITY_LIMIT
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('lastActivity')
      navigate('/login', { replace: true })
      return
    }

    let timeoutId

    function logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('lastActivity')
      navigate('/login', { replace: true })
    }

    function resetTimer() {
      const currentTime = Date.now()

      localStorage.setItem('lastActivity', String(currentTime))

      clearTimeout(timeoutId)
      timeoutId = setTimeout(logout, INACTIVITY_LIMIT)
    }

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timeoutId)

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [token, navigate])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute