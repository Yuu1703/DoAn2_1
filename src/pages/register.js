import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Register.module.css';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      setSuccess('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      setTimeout(() => router.push('/login'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Head>
        <title>Đăng ký - Capyvivu</title>
        <meta name="description" content="Tạo tài khoản mới để bắt đầu hành trình khám phá thế giới cùng Capyvivu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.backgroundElements}>
          <div className={styles.cloud1}>☁️</div>
          <div className={styles.cloud2}>⛅</div>
          <div className={styles.airplane}>
            <img src="/images/airplane.png" alt="Airplane" />
          </div>
          <div className={styles.planet1}>
            <img src="/images/planet.png" alt="Planet" />
          </div>
          <div className={styles.saturn}>
            <img src="/images/saturn.png" alt="Saturn" />
          </div>
          <div className={styles.compass}>🧭</div>
        </div>
        
        <div className={styles.container}>
          <div className={styles.registerBox}>
            <div className={styles.registerHeader}>
              <div className={styles.travelIcon}>
                <img
                  src="/images/Logo Capyvivu - Thiết kế mới với bản đồ.jpg"
                  alt="Capyvivu Logo"
                  className={styles.logoHero}
                />
              </div>
              <h1 className={styles.title}>Tham gia cùng chúng tôi!</h1>
              <p className={styles.subtitle}> Tạo tài khoản để bắt đầu hành trình khám phá thế giới</p>
            </div>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div style={{ color: 'crimson', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
              {success && <div style={{ color: 'green', marginBottom: 12, textAlign: 'center' }}>{success}</div>}
              {/* Full Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="fullname" className={styles.label}>
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className={styles.input}
                  placeholder="Nhập họ và tên của bạn"
                  value={form.fullname}
                  onChange={update('fullname')}
                  required
                />
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email địa chỉ
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </div>

              {/* Phone Field */}
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  placeholder="0123 456 789"
                  value={form.phone}
                  onChange={update('phone')}
                />
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="Tạo mật khẩu mạnh"
                  value={form.password}
                  onChange={update('password')}
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  required
                />
              </div>

              {/* Terms Agreement */}
              <div className={styles.formOptions}>
                <div className={styles.termsAgreement}>
                  <input
                    type="checkbox"
                    id="terms"
                    className={styles.checkbox}
                    required
                  />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    Tôi đồng ý với <a href="/terms" className={styles.link}>Điều khoản dịch vụ</a> và <a href="/privacy" className={styles.link}>Chính sách bảo mật</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? '⏳ Đang tạo tài khoản...' : '🚀 Tạo tài khoản và bắt đầu khám phá'}
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>hoặc đăng ký với</span>
            </div>

            {/* Social Login */}
            <div className={styles.socialLogin}>
              <button className={styles.googleButton}>
                <span className={styles.socialIcon}>G</span> Google
              </button>
              <button className={styles.facebookButton}>
                <span className={styles.socialIcon}>f</span> Facebook
              </button>
              <button className={styles.appleButton}>
                <img src="/images/apple-logo.png" alt="Apple" className={styles.appleIcon} /> Apple
              </button>
            </div>

            {/* Login Link */}
            <div className={styles.loginLink}>
              Đã có tài khoản?{' '}
              <a href="/login" className={styles.link}>
                Đăng nhập ngay 
              </a>
            </div>
            
            {/* Travel Quote */}
            <div className={styles.travelQuote}>
              "🌟 Hành trình nghìn dặm bắt đầu từ một bước chân! ✨"
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}