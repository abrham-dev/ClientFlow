'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

const INACTIVITY_LIMIT = 10 * 60 * 1000
const API_URL = process.env.NEXT_PUBLIC_API_URL

type AuthGuardProps = {
  children: ReactNode
}

type AuthStatus = 'checking' | 'authenticated' | 'error'

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  const [status, setStatus] = useState<AuthStatus>('checking')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    async function checkAuthentication() {
      setStatus('checking')

      const token = localStorage.getItem('token')

      if (!token) {
        router.replace('/login')
        return
      }

      const lastActivity = localStorage.getItem('lastActivity')
      const now = Date.now()

      if (
        lastActivity &&
        (!Number.isFinite(Number(lastActivity)) ||
          now - Number(lastActivity) >= INACTIVITY_LIMIT)
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('lastActivity')
        router.replace('/login')
        return
      }

      if (!API_URL) {
        setStatus('error')
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (cancelled) return

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('lastActivity')
          router.replace('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Could not verify your session.')
        }

        function logout() {
          localStorage.removeItem('token')
          localStorage.removeItem('lastActivity')
          router.replace('/login')
        }

        function resetTimer() {
          const currentTime = Date.now()

          localStorage.setItem('lastActivity', String(currentTime))

          if (timeoutId) {
            clearTimeout(timeoutId)
          }

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
        setStatus('authenticated')

        // Remove event listeners when this component unmounts.
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }

          events.forEach((event) => {
            window.removeEventListener(event, resetTimer)
          })
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    let cleanup: (() => void) | undefined

    checkAuthentication().then((result) => {
      cleanup = result
    })

    return () => {
      cancelled = true

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      cleanup?.()
    }
  }, [router, retry])

  if (status === 'checking') {
    return <p className="p-6">Checking your session...</p>
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>We couldn't verify your session. Please try again.</p>

        <button
          onClick={() => setRetry((current) => current + 1)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return children
}

export default AuthGuard