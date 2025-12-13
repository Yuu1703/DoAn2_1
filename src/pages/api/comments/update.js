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

const upload = multer({ storage }).array("images", 6);

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload);

    const files = req.files || [];
    const body = req.body || {};

    const { commentId, text, existingImages } = body;

    if (!commentId) {
      return res.status(400).json({ ok: false, message: "Missing commentId" });
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

    // Handle images: keep existing + add new ones
    const newImagePaths = files.map((f) => `/images/comments/${f.filename}`);
    const keepImages = existingImages ? JSON.parse(existingImages) : [];
    const allImages = [...keepImages, ...newImagePaths];

    // Update the comment
    const updateDoc = {
      text: text || "",
      images: allImages,
      updatedAt: new Date(),
    };

    await commentsCol.updateOne({ _id: _commentId }, { $set: updateDoc });

    // Return updated comment
    const usersCol = db.collection("User");
    let authorName = "Người dùng";
    try {
      const u = await usersCol.findOne({
        _id: new ObjectId(String(sessionUserId)),
      });
      if (u)
        authorName =
          u.fullname || u.name || u.fullName || u.username || authorName;
    } catch (e) {
      // ignore
    }

    const responseComment = {
      id: String(_commentId),
      authorName,
      text: updateDoc.text,
      images: updateDoc.images,
      createdAt: comment.createdAt,
      updatedAt: updateDoc.updatedAt,
    };

    return res.status(200).json({ ok: true, data: responseComment });
  } catch (err) {
    console.error("UPDATE COMMENT ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
