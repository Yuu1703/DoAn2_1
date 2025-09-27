import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <Head>
        <title>Đăng nhập - Capyvivu</title>
        <meta name="description" content="Đăng nhập để khám phá thế giới cùng Capyvivu" />
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
          <div className={styles.loginBox}>
            <div className={styles.loginHeader}>
              <div className={styles.travelIcon}>
                <span>🌍</span>
                <span>✈️</span>
                <span>🧳</span>
              </div>
              <h1 className={styles.title}>Chào mừng trở lại!</h1>
              <p className={styles.subtitle}> Đăng nhập để tiếp tục hành trình khám phá thế giới</p>
            </div>
            
            <form className={styles.form}>
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

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
              </div>

              <div className={styles.formOptions}>
                <div className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="remember"
                    className={styles.checkbox}
                  />
                  <label htmlFor="remember" className={styles.checkboxLabel}>
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a href="#" className={styles.forgotPassword}>
                  Quên mật khẩu?
                </a>
              </div>

              <button type="submit" className={styles.submitButton}>
                🛫 Bắt đầu hành trình khám phá
              </button>
            </form>

            <div className={styles.divider}>
              <span>hoặc tiếp tục với</span>
            </div>

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

            <div className={styles.signupLink}>
               Mới tham gia Capyvivu?{' '}
              <a href="/register" className={styles.link}>
                Tạo tài khoản mới 🎨
              </a>
            </div>
            
            <div className={styles.travelQuote}>
              "🏖️ Cuộc sống là một chuyến đi, hãy tận hưởng từng khoảnh khắc! "
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
