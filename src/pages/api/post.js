import path from "path";
import fs from "fs";
import multer from "multer";
import { promisify } from "util";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ensure upload dir exists
const uploadDir = path.join(process.cwd(), "public", "images", "Post");
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

const upload = multer({ storage: storage }).array("images", 10);

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

    // expected fields in body (from the client): title, region, province, address, category, priceRange, description, amenities (json), openingHours, phoneNumber, website, authorId
    const {
      title,
      region,
      province,
      address,
      category,
      priceRange,
      description,
      amenities,
      openingHours,
      phoneNumber,
      website,
      authorId,
    } = body;

    const imagePaths = files.map((f) => `/images/Post/${f.filename}`);

    const doc = {
      title: title || "",
      region: region || "",
      province: province || "",
      address: address || "",
      category: category || "",
      priceRange: priceRange || "",
      description: description || "",
      images: imagePaths,
      amenities: [],
      openingHours: openingHours || null,
      phoneNumber: phoneNumber || null,
      website: website || null,
      authorId: authorId ? String(authorId) : null,
      createdAt: new Date(),
    };

    // parse amenities if sent as JSON string
    try {
      if (amenities) {
        if (typeof amenities === "string") {
          doc.amenities = JSON.parse(amenities);
        } else if (Array.isArray(amenities)) {
          doc.amenities = amenities;
        }
      }
    } catch (e) {
      doc.amenities = [];
    }

    const db = await getDb();
    const posts = db.collection("posts");
    const result = await posts.insertOne(doc);

    return res.status(200).json({ ok: true, id: String(result.insertedId) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
}
