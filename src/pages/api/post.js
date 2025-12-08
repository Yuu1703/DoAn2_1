import path from "path";
import fs from "fs";
import multer from "multer";
import { getDb } from "@/lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "images", "Post");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer upload config
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
      resolve();
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload);

    const files = req.files || [];
    const body = req.body || {};

    const {
      title,
      region,
      province,
      address,
      category,
      subcategory,
      priceRange,
      description,
      amenities,
      openingHours,
      phoneNumber,
      website,
      authorId,
    } = body;

    const imagePaths = files.map((f) => `/images/Post/${f.filename}`);

    // Base document
    const doc = {
      title: title || "",
      region: region || "",
      province: province || "",
      address: address || "",
      category: category || "",
      subcategory: subcategory || null,
      priceRange: priceRange || "",
      description: description || "",
      images: imagePaths,
      amenities: [],
      openingHours: null,
      phoneNumber: phoneNumber || null,
      website: website || null,
      authorId: authorId || null,

      // NEW FIELDS
      commentsIds: [], // list commentId
      ratings: {}, // object "userId": ratingValue

      createdAt: new Date(),
    };

    // Amenities
    try {
      if (amenities) {
        doc.amenities =
          typeof amenities === "string" ? JSON.parse(amenities) : amenities;
      }
    } catch (e) {
      doc.amenities = [];
    }

    // Opening hours
    try {
      if (openingHours) {
        doc.openingHours =
          typeof openingHours === "string"
            ? JSON.parse(openingHours)
            : openingHours;
      }
    } catch (e) {
      doc.openingHours = null;
    }

    // Save to DB
    const db = await getDb();
    const posts = db.collection("posts");
    const result = await posts.insertOne(doc);

    return res.status(200).json({ ok: true, id: String(result.insertedId) });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
}
