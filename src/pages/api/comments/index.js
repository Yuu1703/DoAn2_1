import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { postId } = req.query;
      if (!postId)
        return res.status(400).json({ ok: false, message: "Missing postId" });

      const db = await getDb();

      // First try to read post.commentsIds and fetch comments by those ids
      const posts = db.collection("posts");
      const _postId = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;
      const post = await posts.findOne({ _id: _postId });

      let comments = [];

      // If post was fetched and has commentsIds array, resolve those comments
      if (
        post &&
        Array.isArray(post.commentsIds) &&
        post.commentsIds.length > 0
      ) {
        const rawIds = post.commentsIds;

        // Convert to ObjectId when possible, else keep string
        const queryIds = rawIds.map((id) =>
          ObjectId.isValid(id) ? new ObjectId(id) : id
        );

        const fetched = await db
          .collection("comments")
          .find({ _id: { $in: queryIds } })
          .toArray();

        // Map by id string for ordering
        const map = new Map();
        for (const c of fetched) map.set(String(c._id), c);

        comments = rawIds.map((rid) => map.get(String(rid))).filter(Boolean);
      } else {
        // Fallback: older comments may have postId stored on the comment document
        comments = await db
          .collection("comments")
          .find({ postId: String(postId) })
          .sort({ createdAt: -1 })
          .toArray();
      }

      // Populate author name for each comment when possible
      try {
        const userIds = Array.from(
          new Set(comments.map((c) => String(c.userId)).filter(Boolean))
        );
        if (userIds.length > 0) {
          const usersCol = db.collection("User");

          // build ObjectId list and string list
          const objectIds = userIds
            .filter((id) => ObjectId.isValid(id))
            .map((id) => new ObjectId(id));
          const stringIds = userIds.filter((id) => !ObjectId.isValid(id));

          const userQuery = [];
          if (objectIds.length) userQuery.push({ _id: { $in: objectIds } });
          if (stringIds.length) userQuery.push({ _id: { $in: stringIds } });
          if (stringIds.length) userQuery.push({ id: { $in: stringIds } });

          let users = [];
          if (userQuery.length) {
            users = await usersCol.find({ $or: userQuery }).toArray();
          }

          const userMap = new Map();
          for (const u of users) {
            const key = u._id ? String(u._id) : String(u.id || "");
            userMap.set(key, u);
          }

          // attach authorName to comments
          comments = comments.map((c) => {
            const uid = String(c.userId || "");
            const u = userMap.get(uid);
            return Object.assign({}, c, {
              // prefer `fullname` field from User collection, fallback to other name fields
              authorName: u
                ? u.fullname ||
                  u.name ||
                  u.fullName ||
                  u.username ||
                  "Người dùng"
                : "Người dùng",
            });
          });
        }
      } catch (e) {
        console.error("Populate comment authors error:", e);
      }

      return res.status(200).json({ ok: true, data: comments });
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
