import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMe() {
      setLoading(true)
      const res = await fetch('/api/me')
      if (res.status === 401) {
        router.replace('/login')
        return
      }
      const data = await res.json().catch(() => ({}))
      setUser(data.user || null)
      setLoading(false)
    }
    fetchMe()
  }, [router])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.replace('/login')
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 720, margin: '3rem auto', padding: '1rem' }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, <strong>{user.username}</strong></p>
          <button onClick={handleLogout} style={{ padding: '8px 12px' }}>Logout</button>
        </>
      ) : (
        <p>No user data. Redirecting to login...</p>
      )}
    </div>
  )
}
