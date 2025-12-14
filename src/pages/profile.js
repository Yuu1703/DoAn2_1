import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdMessage, setPwdMessage] = useState(null);

  // Posts & favorites state
  const [postsLoading, setPostsLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savingAction, setSavingAction] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Không lấy được thông tin tài khoản');
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load my posts & saved posts when user is available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id) return;
      setPostsLoading(true);
      try {
        const res = await fetch('/api/posts/get-all');
        const json = await res.json();
        const all = Array.isArray(json.data) ? json.data : [];

        // My posts: authorId matches user.id
        const mine = all.filter((p) => {
          const aid = p.authorId || p.author;
          return aid && String(aid) === String(user.id);
        });
        if (!cancelled) setMyPosts(mine);

        // Saved posts via favorites API
        let favIds = [];
        try {
          const favRes = await fetch(`/api/favorites?userId=${encodeURIComponent(String(user.id))}`);
          const favJson = await favRes.json();
          favIds = Array.isArray(favJson.favorites) ? favJson.favorites.map(String) : [];
        } catch (_) {}

        const saved = all.filter((p) => favIds.includes(String(p._id)));
        if (!cancelled) setSavedPosts(saved);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Remove from favorites
  const onUnsave = async (postId) => {
    if (!user?.id || !postId) return;
    setSavingAction(String(postId));
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: String(user.id), destinationId: String(postId), action: 'remove' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Bỏ lưu thất bại');
      setSavedPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingAction(null);
    }
  };

  // Delete my post
  const onDeletePost = async (postId) => {
    if (!postId) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return;
    
    setDeletingPostId(String(postId));
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Xóa bài đăng thất bại');
      setMyPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
      alert('Đã xóa bài đăng thành công');
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingPostId(null);
    }
  };

  const onPwdChange = (e) => {
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));
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
        <title>Thông tin tài khoản - Capyvivu</title>
      </Head>
      <Header />
      <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Thông tin tài khoản</h1>

        {loading && <div>Đang tải...</div>}
        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        {!loading && !user && (
          <div>
            Bạn chưa đăng nhập. Vui lòng{' '}
            <Link href="/login" style={{ color: '#3182ce', fontWeight: 600 }}>đăng nhập</Link>.
          </div>
        )}

        {user && (
          <>
          <section style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '9999px', background: '#EDF2F7',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2D3748'
              }}>
                {(user.fullname || user.email || '?').toString().trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{user.fullname || 'Chưa có tên'}</div>
                <div style={{ color: '#4A5568' }}>{user.email || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Họ và tên</div>
                <div style={{ fontWeight: 600 }}>{user.fullname || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Email</div>
                <div style={{ fontWeight: 600 }}>{user.email || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Số điện thoại</div>
                <div style={{ fontWeight: 600 }}>{user.phone || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>ID</div>
                <div style={{ fontFamily: 'monospace' }}>{user.id}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Ngày sinh</div>
                <div style={{ fontWeight: 600 }}>{user.dob || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Địa chỉ</div>
                <div style={{ fontWeight: 600 }}>{user.address || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Số tài khoản</div>
                <div style={{ fontWeight: 600 }}>{user.bankAccount || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Ngân hàng</div>
                <div style={{ fontWeight: 600 }}>{user.bankName || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: 12 }}>Giới tính</div>
                <div style={{ fontWeight: 600 }}>{user.gender || '—'}</div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <Link
                href="/profile/edit"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 8,
                  background: '#3182ce',
                  color: 'white',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Sửa thông tin
              </Link>
              <Link
                href="/my-posts"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 8,
                  background: '#38a169',
                  color: 'white',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Danh sách bài đăng của tôi
              </Link>
            </div>
          </section>
          <div style={{ height: 24 }} />
          {/* Saved Posts Section */}
          <section style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Đã lưu</h2>
            {postsLoading ? (
              <div>Đang tải...</div>
            ) : savedPosts.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {savedPosts.map((p) => (
                  <div key={String(p._id)} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{p.title || '—'}</div>
                    <div style={{ color: '#4A5568', fontSize: 13 }}>{p.address || ''}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => onUnsave(p._id)}
                        disabled={String(savingAction) === String(p._id)}
                        style={{ background: 'transparent', border: 'none', color: '#E53E3E', cursor: 'pointer' }}
                      >
                        {String(savingAction) === String(p._id) ? 'Đang bỏ lưu…' : 'Bỏ lưu'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Chưa có mục đã lưu.</div>
            )}
          </section>
          <div style={{ height: 24 }} />
          <section style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Đổi mật khẩu</h2>
            <form onSubmit={onSubmitPassword}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
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
                <div>
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
                <div>
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
              </div>
              {pwdError && <div style={{ color: 'crimson', marginTop: 12 }}>{pwdError}</div>}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
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
          </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
