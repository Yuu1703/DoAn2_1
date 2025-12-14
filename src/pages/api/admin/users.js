import { getDb } from "@/lib/mongodb";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // Check if user is admin
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const parts = token.split(":");
    if (parts.length < 2) {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    const userId = parts[1];
    const db = await getDb();
    const users = db.collection("User");
    
    const currentUser = await users.findOne({
      _id: new (require("mongodb").ObjectId)(userId),
    });

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Access denied. Admin only." });
    }

    // Get all users
    const allUsers = await users.find({}).toArray();
    
    // Remove sensitive data
    const safeUsers = allUsers.map(u => ({
      _id: u._id,
      email: u.email,
      fullname: u.fullname,
      phone: u.phone,
      role: u.role || 'user',
      address: u.address || null,
      dob: u.dob || null,
      gender: u.gender || null,
      bankAccount: u.bankAccount || null,
      bankName: u.bankName || null,
      warnings: u.warnings || 0,
    }));

    return res.status(200).json({ ok: true, data: safeUsers });
  } catch (err) {
    console.error("Admin users API error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
