import cookie from 'cookie';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const parts = token.split(':');
    if (parts.length < 2) return res.status(401).json({ message: 'Token không hợp lệ' });
    const userId = parts[1];

    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Xác nhận mật khẩu không khớp' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải từ 6 ký tự' });
    }

    const db = await getDb();
    const users = db.collection('User');
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash || '');
    if (!ok) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: new ObjectId(userId) }, { $set: { passwordHash, updatedAt: new Date() } });
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
