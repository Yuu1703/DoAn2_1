function parseTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(';').map(s => s.trim())
  for (const p of parts) {
    if (p.startsWith('token=')) return p.slice('token='.length)
  }
  return null
}

import { getDb } from '@/lib/mongodb'

export default async function handler(req, res) {
  const token = parseTokenFromCookie(req.headers.cookie || '')
  if (!token) return res.status(401).json({ message: 'Not authenticated' })

  if (!token.startsWith('mocktoken:')) return res.status(401).json({ message: 'Invalid token' })
  const name = decodeURIComponent(token.split(':')[1] || '')

  try {
    const db = await getDb()
    const users = db.collection('User')
    const user = await users.findOne({ $or: [ { email: name }, { username: name } ] }, { projection: { passwordHash: 0 } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json({ user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
