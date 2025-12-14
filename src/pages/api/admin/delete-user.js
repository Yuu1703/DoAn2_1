import { getDb } from "@/lib/mongodb";
import cookie from "cookie";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
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

    const adminId = parts[1];
    const db = await getDb();
    const users = db.collection("User");
    
    const currentUser = await users.findOne({
      _id: new ObjectId(adminId),
    });

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Access denied. Admin only." });
    }

    // Get userId to delete
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ ok: false, message: "userId is required" });
    }

    // Prevent deleting admin accounts
    const userToDelete = await users.findOne({
      _id: new ObjectId(userId),
    });

    if (!userToDelete) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    if (userToDelete.role === "admin") {
      return res.status(403).json({ ok: false, message: "Cannot delete admin accounts" });
    }

    // Delete the user
    await users.deleteOne({ _id: new ObjectId(userId) });

    return res.status(200).json({ ok: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user API error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
