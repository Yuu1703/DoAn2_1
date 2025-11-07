import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ fullname: '', phone: '', dob: '', address: '', bankAccount: '', bankName: '', gender: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdMessage, setPwdMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled) {
          if (!data.user) setError('Bạn chưa đăng nhập');
          else setForm({
            fullname: data.user.fullname || '',
            phone: data.user.phone || '',
            dob: data.user.dob || '',
            address: data.user.address || '',
            bankAccount: data.user.bankAccount || '',
            bankName: data.user.bankName || '',
            gender: data.user.gender || '',
          });
        }
      } catch (e) {
        if (!cancelled) setError('Không tải được thông tin');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const onPwdChange = (e) => {
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');
      setMessage('Đã lưu thay đổi');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    setPwdSaving(true);
    setPwdError(null);
    setPwdMessage(null);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwd),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại');
      setPwdMessage('Đã đổi mật khẩu');
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPwdError(e.message);
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sửa thông tin - Capyvivu</title>
      </Head>
      <Header />
      <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Sửa thông tin</h1>
        {loading && <div>Đang tải...</div>}
        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
        {!loading && !error && (
          <>
          <form onSubmit={onSubmit} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Họ và tên</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={onChange}
                placeholder="Nhập họ và tên"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Ngày sinh</label>
              <input
                name="dob"
                value={form.dob}
                onChange={onChange}
                placeholder="YYYY-MM-DD"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Địa chỉ</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Nhập địa chỉ"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Số tài khoản</label>
              <input
                name="bankAccount"
                value={form.bankAccount}
                onChange={onChange}
                placeholder="Nhập số tài khoản ngân hàng"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Ngân hàng</label>
              <input
                name="bankName"
                value={form.bankName}
                onChange={onChange}
                placeholder="Tên ngân hàng"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Giới tính</label>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0', background: 'white' }}
              >
                <option value="">— Chọn —</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Nhập số điện thoại"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.6rem 1rem', borderRadius: 8, background: '#3182ce', color: 'white', fontWeight: 600,
                  opacity: saving ? 0.8 : 1
                }}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <Link href="/profile" style={{ color: '#4A5568' }}>Hủy</Link>
              {message && <span style={{ color: '#2F855A' }}>{message}</span>}
            </div>
          </form>
          <div style={{ height: 24 }} />
          <form onSubmit={onSubmitPassword} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Đổi mật khẩu</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Mật khẩu hiện tại</label>
              <input
                type="password"
                name="currentPassword"
                value={pwd.currentPassword}
                onChange={onPwdChange}
                placeholder="Nhập mật khẩu hiện tại"
                autoComplete="current-password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={pwd.newPassword}
                onChange={onPwdChange}
                placeholder="Ít nhất 6 ký tự"
                autoComplete="new-password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#718096', marginBottom: 6 }}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={pwd.confirmPassword}
                onChange={onPwdChange}
                placeholder="Nhập lại mật khẩu mới"
                autoComplete="new-password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E0' }}
              />
            </div>
            {pwdError && <div style={{ color: 'crimson', marginBottom: 8 }}>{pwdError}</div>}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
                disabled={pwdSaving}
                style={{
                  padding: '0.6rem 1rem', borderRadius: 8, background: '#2D3748', color: 'white', fontWeight: 600,
                  opacity: pwdSaving ? 0.8 : 1
                }}
              >
                {pwdSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
              {pwdMessage && <span style={{ color: '#2F855A' }}>{pwdMessage}</span>}
            </div>
          </form>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
