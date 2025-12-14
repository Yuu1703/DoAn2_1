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

    // Get postId to delete
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ ok: false, message: "postId is required" });
    }

    const posts = db.collection("posts");
    const _id = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;

    // Delete the post
    const attempts = [
      { filter: { _id } },
      ...(typeof postId === "string" ? [{ filter: { _id: postId } }] : []),
      ...(typeof postId === "string" ? [{ filter: { id: postId } }] : []),
    ];

    let deleted = 0;
    for (const att of attempts) {
      const resDel = await posts.deleteOne(att.filter);
      deleted += resDel.deletedCount || 0;
      if (resDel.deletedCount) break;
    }

    if (!deleted) {
      return res.status(404).json({ ok: false, message: "Post not found" });
    }

    return res.status(200).json({ ok: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Admin delete post API error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
