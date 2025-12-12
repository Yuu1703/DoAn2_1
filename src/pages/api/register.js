import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fullname, email, phone, password, confirmPassword } =
      req.body || {};

    // Basic validation
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const db = await getDb();
    const users = db.collection("User");

    const exists = await users.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = {
      fullname: fullname || "",
      email,
      phone: phone || "",
      passwordHash,
      favorites: [], 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await users.insertOne(doc);
    return res.status(201).json({ ok: true, id: insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
