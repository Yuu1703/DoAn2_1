// pages/api/login.js
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password } = req.body || {};

    const db = await getDb();
    const users = db.collection("User");
    const user = await users.findOne({
      $or: [{ email: username }, { username }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // token mock chứa userId và username (không an toàn cho production)
    const userId = String(user._id);
    const nameForToken = encodeURIComponent(user.username || user.email);
    const token = `mocktoken:${userId}:${nameForToken}`;

    const secureFlag = process.env.NODE_ENV === "production" ? "Secure; " : "";
    // HttpOnly cookie (client JS không thể đọc) — max-age 1h
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; ${secureFlag}`
    );

    // Optionally return some minimal info (no sensitive fields)
    return res.status(200).json({
      ok: true,
      user: { 
        id: userId, 
        username: user.username, 
        email: user.email,
        role: user.role || 'user'
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
