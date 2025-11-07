import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Login.module.css";
import { useUser } from "@/context/UserContext"; // import

export default function Login() {
  const router = useRouter();
  const { refresh } = useUser(); // lấy hàm refresh
  // ...state như trước
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
      // gọi /api/me để cập nhật context ngay
      await refresh();
      // successful -> go to dashboard
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Đăng nhập - Capyvivu</title>
        <meta
          name="description"
          content="Đăng nhập để khám phá thế giới cùng Capyvivu"
        />
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
                <img
                  src="/images/Logo Capyvivu - Thiết kế mới với bản đồ.jpg"
                  alt="Capyvivu Logo"
                  className={styles.logoHero}
                />
              </div>
              <h1 className={styles.title}>Chào mừng trở lại!</h1>
              <p className={styles.subtitle}>
                Đăng nhập để tiếp tục hành trình khám phá thế giới
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    color: "crimson",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email / Username
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading
                  ? "⏳ Đang đăng nhập..."
                  : "🛫 Bắt đầu hành trình khám phá"}
              </button>
            </form>

            <div className={styles.divider}>
              <span>hoặc tiếp tục với</span>
            </div>

            <div className={styles.socialLogin}>
              <button className={styles.googleButton} type="button">
                <span className={styles.socialIcon}>G</span> Google
              </button>
              <button className={styles.facebookButton} type="button">
                <span className={styles.socialIcon}>f</span> Facebook
              </button>
              <button className={styles.appleButton} type="button">
                <img
                  src="/images/apple-logo.png"
                  alt="Apple"
                  className={styles.appleIcon}
                />{" "}
                Apple
              </button>
            </div>

            <div className={styles.signupLink}>
              Mới tham gia Capyvivu?{" "}
              <a href="/register" className={styles.link}>
                Tạo tài khoản mới 🎨
              </a>
            </div>

            <div className={styles.travelQuote}>
              "🏖️ Cuộc sống là một chuyến đi, hãy tận hưởng từng khoảnh khắc! "
            </div>

            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "#666",
                textAlign: "center",
              }}
            >
              Demo: <strong>admin / password</strong>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
