// pages/api/logout.js
export default function handler(req, res) {
  const secureFlag = process.env.NODE_ENV === "production" ? "Secure; " : "";
  res.setHeader(
    "Set-Cookie",
    `token=deleted; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${secureFlag}`
  );
  return res.status(200).json({ ok: true });
}
