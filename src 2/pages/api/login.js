import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body || {}

    const db = await getDb()
    const users = db.collection('User')
    const user = await users.findOne({ $or: [ { email: username }, { username } ] })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash || '')
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    // create a simple mock token (not secure) and set as httpOnly cookie
    const nameForToken = encodeURIComponent(user.username || user.email)
    const token = `mocktoken:${nameForToken}`
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; ${secureFlag}`)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
