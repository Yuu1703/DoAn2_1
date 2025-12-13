import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { commentId, postId } = req.body;

    if (!commentId || !postId) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing commentId or postId" });
    }

    // Get authenticated user
    const cookie = require("cookie");
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    let sessionUserId = null;
    if (token) {
      const parts = token.split(":");
      if (parts.length >= 2) sessionUserId = parts[1];
    }

    if (!sessionUserId) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }

    const db = await getDb();
    const commentsCol = db.collection("comments");

    // Find the comment
    const _commentId = ObjectId.isValid(commentId)
      ? new ObjectId(commentId)
      : commentId;
    const comment = await commentsCol.findOne({ _id: _commentId });

    if (!comment) {
      return res.status(404).json({ ok: false, message: "Comment not found" });
    }

    // Check if user is the owner
    if (String(comment.userId) !== String(sessionUserId)) {
      return res.status(403).json({ ok: false, message: "Unauthorized" });
    }

    // Delete the comment
    await commentsCol.deleteOne({ _id: _commentId });

    // Remove commentId from post.commentsIds
    const posts = db.collection("posts");
    try {
      const _postId = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;
      await posts.updateOne(
        { _id: _postId },
        { $pull: { commentsIds: String(commentId) } }
      );
    } catch (e) {
      console.error("Failed to remove commentId from post:", e);
    }

    return res.status(200).json({ ok: true, message: "Comment deleted" });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
