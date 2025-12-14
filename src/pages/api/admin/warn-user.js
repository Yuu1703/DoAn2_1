import { getDb } from "@/lib/mongodb";
import cookie from "cookie";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    // Get postId to warn the author
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ ok: false, message: "postId is required" });
    }

    const posts = db.collection("posts");
    const _id = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;

    // Find the post to get author
    let post = await posts.findOne({ _id });
    if (!post && typeof postId === "string") {
      post = (await posts.findOne({ _id: postId })) || (await posts.findOne({ id: postId }));
    }

    if (!post) {
      return res.status(404).json({ ok: false, message: "Post not found" });
    }

    // Get author ID
    const authorId = post.authorId || post.author;
    if (!authorId) {
      return res.status(400).json({ ok: false, message: "Post has no author" });
    }

    // Update user's warning count
    const authorObjId = ObjectId.isValid(authorId) ? new ObjectId(authorId) : authorId;
    
    const result = await users.updateOne(
      { _id: authorObjId },
      { $inc: { warnings: 1 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ ok: false, message: "Author not found" });
    }

    // Get updated warning count
    const updatedUser = await users.findOne({ _id: authorObjId });
    const warningCount = updatedUser?.warnings || 1;

    return res.status(200).json({ 
      ok: true, 
      message: `Đã cảnh báo tác giả. Tổng số cảnh báo: ${warningCount}`,
      warnings: warningCount
    });
  } catch (err) {
    console.error("Admin warn user API error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
