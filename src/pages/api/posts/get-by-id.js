import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ ok: false, message: "Missing id" });
  }

  try {
    const db = await getDb();
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const post = await db.collection("posts").findOne({ _id });

    if (!post) {
      return res.status(404).json({ ok: false, message: "Post not found" });
    }

    // populate author name when possible (do not expose sensitive fields)
    try {
      const users = db.collection("User");
      const authorId = post.authorId || post.author || null;
      if (authorId) {
        const authorKey = ObjectId.isValid(authorId)
          ? new ObjectId(authorId)
          : authorId;
        const user = await users.findOne({ _id: authorKey });
        if (user) {
          post.authorName =
            user.fullname ||
            user.name ||
            user.fullName ||
            user.username ||
            null;
        }
      }
    } catch (e) {
      console.error("Failed to populate post author name:", e);
    }

    // compute rating summary from post.ratings (object of userId -> value)
    try {
      const ratingsObj =
        post && post.ratings && typeof post.ratings === "object"
          ? post.ratings
          : {};
      const ratingValues = Object.values(ratingsObj || {})
        .map(Number)
        .filter((v) => !Number.isNaN(v));

      const ratingCount = ratingValues.length;
      const ratingAvg =
        ratingCount > 0
          ? Number(
              (ratingValues.reduce((a, b) => a + b, 0) / ratingCount).toFixed(1)
            )
          : null;

      post.ratingCount = ratingCount;
      post.ratingAvg = ratingAvg;
    } catch (e) {
      console.error("Failed to compute rating summary:", e);
      post.ratingCount = 0;
      post.ratingAvg = null;
    }

    // remove sensitive fields before sending to client (keep authorId for ownership checks)
    try {
      if (post && post.userId) delete post.userId;
      if (post && post.author) delete post.author;
    } catch (e) {
      // ignore
    }

    return res.status(200).json({ ok: true, data: post });
  } catch (err) {
    console.error("FETCH POST BY ID ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
