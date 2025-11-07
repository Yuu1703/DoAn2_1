// pages/api/me.js
import { getDb } from "@/lib/mongodb";
import cookie from "cookie";

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(200).json({ user: null }); // not logged in

    // token format: mocktoken:<userId>:<name>
    const parts = token.split(":");
    if (parts.length < 2) return res.status(200).json({ user: null });

    const userId = parts[1];

    const db = await getDb();
    const users = db.collection("User");
    const user = await users.findOne({
      _id: new (require("mongodb").ObjectId)(userId),
    });

    if (!user) return res.status(200).json({ user: null });

    // trả về thông tin đã lọc (không trả passwordHash...)
    const safeUser = {
      id: String(user._id),
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      dob: user.dob || null,
      address: user.address || null,
      bankAccount: user.bankAccount || null,
      bankName: user.bankName || null,
      gender: user.gender || null,
    };

    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
