// API để khởi tạo tài khoản admin mặc định
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const users = db.collection("User");

    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await users.findOne({ 
      $or: [
        { email: "admin@admin.com" },
        { username: "admin" }
      ]
    });

    if (existingAdmin) {
      return res.status(200).json({ 
        ok: true, 
        message: "Tài khoản admin đã tồn tại",
        existed: true
      });
    }

    // Tạo password hash
    const passwordHash = await bcrypt.hash("admin", 10);

    // Tạo tài khoản admin
    const adminUser = {
      email: "admin@admin.com",
      username: "admin",
      fullname: "Administrator",
      passwordHash,
      role: "admin",
      phone: "",
      dob: null,
      address: null,
      bankAccount: null,
      bankName: null,
      gender: null,
      favorites: [],
      createdAt: new Date().toISOString(),
    };

    await users.insertOne(adminUser);

    return res.status(201).json({ 
      ok: true, 
      message: "Đã tạo tài khoản admin thành công",
      user: {
        username: "admin",
        email: "admin@admin.com",
        password: "admin"
      }
    });
  } catch (err) {
    console.error("Init admin error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
