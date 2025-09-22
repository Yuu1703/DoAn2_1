import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <Head>
        <title>Đăng nhập - DoAn2_3</title>
        <meta name="description" content="Đăng nhập vào tài khoản của bạn" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <h1 className={styles.title}>Đăng nhập</h1>
            <p className={styles.subtitle}>Chào mừng bạn quay trở lại!</p>
            
            <form className={styles.form}>
              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="Nhập email của bạn"
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
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
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

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                Đăng nhập
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>hoặc</span>
            </div>

            {/* Social Login */}
            <div className={styles.socialLogin}>
              <button className={styles.googleButton}>
                🔍 Đăng nhập với Google
              </button>
              <button className={styles.facebookButton}>
                📘 Đăng nhập với Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className={styles.signupLink}>
              Chưa có tài khoản?{' '}
              <a href="/register" className={styles.link}>
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
