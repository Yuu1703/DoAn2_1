import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "images", "Post");
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (_) {}

// Multer storage
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

const upload = multer({ storage }).array("images", 10);

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) return reject(err);
      resolve(null);
    });
  });
}

function sanitizeUpdate(body) {
  const allowed = [
    "title",
    "region",
    "province",
    "address",
    "category",
    "priceRange",
    "description",
    "amenities",
    "openingHours",
    "phoneNumber",
    "website",
    "subcategory",
  ];
  const result = {};
  for (const key of allowed) {
    if (key in body) result[key] = body[key];
  }
  return result;
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, message: "Missing id" });

  try {
    const db = await getDb();
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;

    if (req.method === "GET") {
      const post = await db.collection("posts").findOne({ _id });
      if (!post)
        return res.status(404).json({ ok: false, message: "Post not found" });

      // populate author name when possible
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
        // ignore population errors
      }

      // compute rating summary
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
                (ratingValues.reduce((a, b) => a + b, 0) / ratingCount).toFixed(
                  1
                )
              )
            : null;
        post.ratingCount = ratingCount;
        post.ratingAvg = ratingAvg;
      } catch (e) {
        post.ratingCount = 0;
        post.ratingAvg = null;
      }

      // remove sensitive fields
      try {
        if (post && post.authorId) delete post.authorId;
        if (post && post.userId) delete post.userId;
        if (post && post.author) delete post.author;
      } catch (e) {}

      return res.status(200).json({ ok: true, data: post });
    }

    if (req.method === "PUT") {
      const col = db.collection("posts");

      const isMultipart = (req.headers["content-type"] || "").includes(
        "multipart/form-data"
      );
      let update = {};
      let files = [];

      if (isMultipart) {
        await runMiddleware(req, res, upload);
        files = req.files || [];
        const body = req.body || {};
        // Build update from multipart fields
        try {
          update = sanitizeUpdate({
            title: body.title,
            region: body.region,
            province: body.province,
            address: body.address,
            category: body.category,
            priceRange: body.priceRange,
            description: body.description,
            openingHours: body.openingHours,
            phoneNumber: body.phoneNumber,
            website: body.website,
            amenities: body.amenities ? JSON.parse(body.amenities) : [],
            subcategory: body.subcategory,
          });
        } catch (e) {
          update = sanitizeUpdate(body || {});
        }
      } else {
        // JSON update
        let body = req.body;
        if (typeof body === "string") {
          try {
            body = JSON.parse(body);
          } catch (e) {
            return res.status(400).json({ ok: false, message: "Invalid JSON" });
          }
        }
        update = sanitizeUpdate(body || {});
      }

      // If new files uploaded, replace images with new file paths
      if (Array.isArray(files) && files.length > 0) {
        const imagePaths = files.map((f) => `/images/Post/${f.filename}`);
        update.images = imagePaths;
      }

      update.updatedAt = new Date().toISOString();

      // Attempt updates across possible key types
      const attempts = [
        { filter: { _id }, note: "_id:ObjectId" },
        ...(typeof id === "string"
          ? [{ filter: { _id: id }, note: "_id:string" }]
          : []),
        ...(typeof id === "string"
          ? [{ filter: { id }, note: "id:string" }]
          : []),
      ];

      let matched = 0;
      for (const att of attempts) {
        const resUpd = await col.updateOne(att.filter, { $set: update });
        matched += resUpd.matchedCount || 0;
        if (resUpd.matchedCount) break;
      }

      if (!matched) {
        return res.status(404).json({ ok: false, message: "Post not found" });
      }

      // Fetch updated doc
      let updated = await col.findOne({ _id });
      if (!updated && typeof id === "string") {
        updated =
          (await col.findOne({ _id: id })) || (await col.findOne({ id }));
      }
      if (!updated) {
        return res.status(404).json({ ok: false, message: "Post not found" });
      }

      // remove sensitive fields in response
      updated = { ...updated };
      try {
        if (updated && updated.authorId) delete updated.authorId;
        if (updated && updated.userId) delete updated.userId;
        if (updated && updated.author) delete updated.author;
      } catch (e) {}

      return res.status(200).json({ ok: true, data: updated });
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  } catch (err) {
    console.error("POSTS [id] handler error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
