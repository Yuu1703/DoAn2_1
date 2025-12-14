import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'posts'
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  
  // Posts state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [warningPostId, setWarningPostId] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!userLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [userLoading, user, router]);

  // Load users
  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      loadUsers();
    }
  }, [activeTab, user]);

  // Load posts
  useEffect(() => {
    if (activeTab === 'posts' && user?.role === 'admin') {
      loadPosts();
    }
  }, [activeTab, user]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (res.ok && json.ok) {
        setUsers(json.data || []);
      } else {
        alert(json.message || 'Không thể tải danh sách users');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi khi tải users');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetch('/api/posts/get-all');
      const json = await res.json();
      if (res.ok && json.ok) {
        setPosts(json.data || []);
      } else {
        alert('Không thể tải danh sách bài đăng');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi khi tải bài đăng');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    
    setDeletingUserId(userId);
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Xóa user thất bại');
      
      setUsers(prev => prev.filter(u => String(u._id) !== String(userId)));
      alert('Đã xóa tài khoản thành công');
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return;
    
    setDeletingPostId(postId);
    try {
      const res = await fetch(`/api/admin/delete-post`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Xóa bài đăng thất bại');
      
      setPosts(prev => prev.filter(p => String(p._id) !== String(postId)));
      alert('Đã xóa bài đăng thành công');
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleWarnPost = async (postId) => {
    if (!confirm('Bạn có chắc chắn muốn cảnh báo tác giả bài đăng này?')) return;
    
    setWarningPostId(postId);
    try {
      const res = await fetch('/api/admin/warn-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Cảnh báo thất bại');
      
      alert(json.message);
      // Reload users to update warning count
      if (activeTab === 'users') {
        loadUsers();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setWarningPostId(null);
    }
  };

  if (userLoading) {
    return (
      <>
        <Head>
          <title>Admin Dashboard - VietJourney</title>
        </Head>
        <Header />
        <main style={{ maxWidth: 1400, margin: '2rem auto', padding: '0 1rem' }}>
          <div>Đang kiểm tra quyền truy cập...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - VietJourney</title>
      </Head>
      <Header />
      <main style={{ maxWidth: 1400, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ color: '#718096', marginBottom: 24 }}>Quản lý người dùng và bài đăng</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #3182ce' : '3px solid transparent',
              color: activeTab === 'users' ? '#3182ce' : '#4A5568',
              fontWeight: activeTab === 'users' ? 700 : 600,
              cursor: 'pointer',
              fontSize: 16,
              marginBottom: -2
            }}
          >
            👥 Người dùng ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'posts' ? '3px solid #3182ce' : '3px solid transparent',
              color: activeTab === 'posts' ? '#3182ce' : '#4A5568',
              fontWeight: activeTab === 'posts' ? 700 : 600,
              cursor: 'pointer',
              fontSize: 16,
              marginBottom: -2
            }}
          >
            📝 Bài đăng ({posts.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {usersLoading ? (
              <div>Đang tải danh sách người dùng...</div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12 }}>
                Không có người dùng nào
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>Họ tên</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>Email</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>SĐT</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>Role</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 14 }}>Địa chỉ</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 14 }}>⚠️ Cảnh báo</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 14 }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={String(u._id)} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace', color: '#718096' }}>
                          {String(u._id).slice(-6)}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.fullname || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{u.email || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{u.phone || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            background: u.role === 'admin' ? '#FED7D7' : '#C6F6D5',
                            color: u.role === 'admin' ? '#C53030' : '#22543D'
                          }}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{u.address || '—'}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 700,
                            background: (u.warnings || 0) > 0 ? '#FED7D7' : '#E2E8F0',
                            color: (u.warnings || 0) > 0 ? '#C53030' : '#718096'
                          }}>
                            {u.warnings || 0}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={String(deletingUserId) === String(u._id) || u.role === 'admin'}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              background: u.role === 'admin' ? '#CBD5E0' : (String(deletingUserId) === String(u._id) ? '#CBD5E0' : '#E53E3E'),
                              color: 'white',
                              fontSize: 13,
                              border: 'none',
                              cursor: (String(deletingUserId) === String(u._id) || u.role === 'admin') ? 'not-allowed' : 'pointer',
                              fontWeight: 600
                            }}
                          >
                            {String(deletingUserId) === String(u._id) ? 'Đang xóa...' : (u.role === 'admin' ? 'Admin' : 'Xóa')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {postsLoading ? (
              <div>Đang tải danh sách bài đăng...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12 }}>
                Không có bài đăng nào
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {posts.map((p) => (
                  <div key={String(p._id)} style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: 12, 
                    padding: 16,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    {p.images && p.images[0] && (
                      <div style={{ 
                        width: '100%', 
                        height: 180, 
                        borderRadius: 8, 
                        overflow: 'hidden',
                        marginBottom: 12,
                        background: '#f7fafc'
                      }}>
                        <img 
                          src={p.images[0]} 
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{p.title || '—'}</div>
                    <div style={{ color: '#4A5568', fontSize: 13, marginBottom: 8 }}>{p.address || ''}</div>
                    <div style={{ fontSize: 12, color: '#718096', marginBottom: 12 }}>
                      ID: {String(p._id).slice(-8)}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link
                          href={`/DeitalPost?id=${p._id}`}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: '#3182ce',
                            color: 'white',
                            fontSize: 13,
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontWeight: 600
                          }}
                        >
                          Xem
                        </Link>
                        <button
                          onClick={() => handleWarnPost(p._id)}
                          disabled={String(warningPostId) === String(p._id)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: String(warningPostId) === String(p._id) ? '#CBD5E0' : '#ED8936',
                            color: 'white',
                            fontSize: 13,
                            border: 'none',
                            cursor: String(warningPostId) === String(p._id) ? 'not-allowed' : 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {String(warningPostId) === String(p._id) ? 'Đang gửi...' : '⚠️ Cảnh báo'}
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        disabled={String(deletingPostId) === String(p._id)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: String(deletingPostId) === String(p._id) ? '#CBD5E0' : '#E53E3E',
                          color: 'white',
                          fontSize: 13,
                          border: 'none',
                          cursor: String(deletingPostId) === String(p._id) ? 'not-allowed' : 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {String(deletingPostId) === String(p._id) ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
