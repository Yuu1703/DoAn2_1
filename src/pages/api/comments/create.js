import path from "path";
import fs from "fs";
import multer from "multer";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "images", "comments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${unique}-${safe}`);
  },
});

// ✅ Thay đổi từ 6 → 3 ảnh
const upload = multer({ storage }).array("images", 3);

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload);

    const files = req.files || [];
    const body = req.body || {};

    const { postId, text } = body;

    if (!postId) {
      return res.status(400).json({ ok: false, message: "Missing postId" });
    }

    // ✅ Kiểm tra số lượng ảnh
    if (files.length > 3) {
      return res.status(400).json({
        ok: false,
        message: "Chỉ được tải tối đa 3 ảnh",
      });
    }

    // Derive userId from session cookie
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

    const imagePaths = files.map((f) => `/images/comments/${f.filename}`);

    const commentDoc = {
      userId: String(sessionUserId),
      text: text || "",
      images: imagePaths,
      createdAt: new Date(),
    };

    const db = await getDb();
    const commentsCol = db.collection("comments");
    const result = await commentsCol.insertOne(commentDoc);
    const insertedId = String(result.insertedId);

    // Push comment id into post.commentsIds
    const posts = db.collection("posts");
    try {
      const _id = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;
      await posts.updateOne({ _id }, { $push: { commentsIds: insertedId } });
    } catch (e) {
      console.error("Failed to push commentId to post:", e);
    }

    // Return created comment
    const usersCol = db.collection("User");
    let authorName = "Người dùng";
    try {
      const u = await usersCol.findOne({
        _id: new ObjectId(String(sessionUserId)),
      });
      if (u)
        authorName =
          u.name || u.fullname || u.fullName || u.username || authorName;
    } catch (e) {
      // ignore
    }

    const responseComment = {
      id: insertedId,
      authorName,
      text: commentDoc.text,
      images: commentDoc.images,
      createdAt: commentDoc.createdAt,
    };

    return res.status(200).json({ ok: true, data: responseComment });
  } catch (err) {
    console.error("CREATE COMMENT ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
