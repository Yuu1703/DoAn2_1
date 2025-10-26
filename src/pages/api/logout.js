export default function handler(req, res) {
  // Clear the cookie by setting Max-Age=0
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`)
  return res.status(200).json({ ok: true })
}
