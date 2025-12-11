import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { postId, rating } = req.body || {};
    if (!postId || typeof rating === "undefined") {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    // derive userId from session cookie
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
    const posts = db.collection("posts");

    // Check if user already rated
    const _id = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;
    const post = await posts.findOne({ _id });
    const existing = post?.ratings?.[String(sessionUserId)];
    if (existing) {
      return res.status(400).json({ ok: false, message: "User already rated" });
    }

    // Set rating for user
    const key = `ratings.${String(sessionUserId)}`;
    await posts.updateOne({ _id }, { $set: { [key]: Number(rating) } });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("ADD RATING ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
