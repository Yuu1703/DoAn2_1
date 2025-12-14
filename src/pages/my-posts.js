import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

export default function MyPostsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [postsLoading, setPostsLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id) return;
      setPostsLoading(true);
      try {
        const res = await fetch('/api/posts/get-all');
        const json = await res.json();
        const all = Array.isArray(json.data) ? json.data : [];

        const mine = all.filter((p) => {
          const aid = p.authorId || p.author;
          return aid && String(aid) === String(user.id);
        });
        if (!cancelled) setMyPosts(mine);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

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

  if (userLoading) {
    return (
      <>
        <Head>
          <title>Bài đăng của tôi - VietJourney</title>
        </Head>
        <Header />
        <main style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
          <div>Đang tải...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Bài đăng của tôi - VietJourney</title>
      </Head>
      <Header />
      <main style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Bài đăng của tôi</h1>
          <Link
            href="/Post"
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 8,
              background: '#38a169',
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            + Tạo bài đăng mới
          </Link>
        </div>

        {postsLoading ? (
          <div>Đang tải...</div>
        ) : myPosts.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {myPosts.map((p) => (
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
                <div style={{ color: '#4A5568', fontSize: 13, marginBottom: 12 }}>{p.address || ''}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/DeitalPost?id=${p._id}`}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: '#EDF2F7',
                      color: '#2D3748',
                      fontSize: 13,
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontWeight: 600
                    }}
                  >
                    Xem
                  </Link>
                  <Link
                    href={`/post/edit/${p._id}`}
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
                    Sửa
                  </Link>
                  <button
                    onClick={() => onDeletePost(p._id)}
                    disabled={String(deletingPostId) === String(p._id)}
                    style={{
                      flex: 1,
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
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Chưa có bài đăng nào</div>
            <div style={{ color: '#718096', marginBottom: 20 }}>Bắt đầu chia sẻ những địa điểm du lịch tuyệt vời của bạn!</div>
            <Link
              href="/Post"
              style={{
                display: 'inline-block',
                padding: '0.6rem 1.5rem',
                borderRadius: 8,
                background: '#3182ce',
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Tạo bài đăng đầu tiên
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
