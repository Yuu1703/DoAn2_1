import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Register.module.css';

export default function Register() {
  return (
    <>
      <Head>
        <title>Đăng ký - Travel Explorer</title>
        <meta name="description" content="Tạo tài khoản để bắt đầu hành trình khám phá thế giới" />
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
                <span>🌍</span>
                <span>✈️</span>
                <span>🧳</span>
              </div>
              <h1 className={styles.title}>Tham gia cùng chúng tôi!</h1>
              <p className={styles.subtitle}> Tạo tài khoản để bắt đầu hành trình khám phá thế giới</p>
            </div>
            
            <form className={styles.form}>
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
                  placeholder="your@email.com"
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
                  required
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
              <button type="submit" className={styles.submitButton}>
                🚀 Tạo tài khoản và bắt đầu khám phá
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