import cookie from 'cookie';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const parts = token.split(':');
    if (parts.length < 2) return res.status(401).json({ message: 'Token không hợp lệ' });
    const userId = parts[1];

  const { fullname, phone, dob, address, bankAccount, bankName, gender } = req.body || {};
    const update = {};
    if (typeof fullname === 'string') update.fullname = fullname.trim();
    if (typeof phone === 'string') update.phone = phone.trim();
  if (typeof dob === 'string') update.dob = dob.trim();
  if (typeof address === 'string') update.address = address.trim();
  if (typeof bankAccount === 'string') update.bankAccount = bankAccount.trim();
  if (typeof bankName === 'string') update.bankName = bankName.trim();
  if (typeof gender === 'string') update.gender = gender.trim();

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Không có dữ liệu cần cập nhật' });
    }

    const db = await getDb();
    const users = db.collection('User');
    await users.updateOne({ _id: new ObjectId(userId) }, { $set: update });
    const user = await users.findOne({ _id: new ObjectId(userId) });
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
    return res.status(200).json({ message: 'Cập nhật thành công', user: safeUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
