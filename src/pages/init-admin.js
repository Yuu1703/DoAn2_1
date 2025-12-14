import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InitAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [adminCreated, setAdminCreated] = useState(false);

  const handleCreateAdmin = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const res = await fetch('/api/init-admin', {
        method: 'POST',
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setMessage(json.message);
        if (!json.existed) {
          setAdminCreated(true);
        }
      } else {
        setError(json.message || 'Có lỗi xảy ra');
      }
    } catch (e) {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Khởi tạo Admin - VietJourney</title>
      </Head>
      <Header />
      <main style={{ 
        maxWidth: 600, 
        margin: '4rem auto', 
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '3rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Khởi tạo tài khoản Admin
          </h1>
          <p style={{ color: '#718096', marginBottom: 32, fontSize: 15 }}>
            Nhấn nút bên dưới để tạo tài khoản admin mặc định
          </p>

          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#C6F6D5',
              color: '#22543D',
              marginBottom: 20,
              fontWeight: 600
            }}>
              ✓ {message}
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#FED7D7',
              color: '#C53030',
              marginBottom: 20,
              fontWeight: 600
            }}>
              ✗ {error}
            </div>
          )}

          {adminCreated && (
            <div style={{
              padding: '16px',
              borderRadius: 8,
              background: '#EDF2F7',
              border: '2px solid #CBD5E0',
              marginBottom: 24,
              textAlign: 'left'
            }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
                Thông tin đăng nhập:
              </div>
              <div style={{ fontSize: 14, fontFamily: 'monospace' }}>
                <div><strong>Email:</strong> admin@admin.com</div>
                <div><strong>Username:</strong> admin</div>
                <div><strong>Password:</strong> admin</div>
              </div>
            </div>
          )}

          <button
            onClick={handleCreateAdmin}
            disabled={loading}
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              background: loading ? '#CBD5E0' : '#3182ce',
              color: 'white',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Đang tạo...' : 'Tạo tài khoản Admin'}
          </button>

          <div style={{ 
            marginTop: 24, 
            padding: '12px', 
            background: '#FFF5F5', 
            borderRadius: 8,
            fontSize: 13,
            color: '#C53030'
          }}>
            ⚠️ Sau khi tạo, hãy đổi mật khẩu admin ngay để bảo mật
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
