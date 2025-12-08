import { getDb } from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const posts = await db.collection("posts").find({}).toArray();

    return res.status(200).json({ ok: true, data: posts });
  } catch (err) {
    console.error("FETCH POSTS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
