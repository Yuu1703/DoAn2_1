import Link from "next/link";
import { useMobileMenu } from "../hooks/useMobileMenu";
import { useUser } from "@/context/UserContext"; // import context
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { isOpen, toggleMenu } = useMobileMenu();
  const { user, refresh } = useUser(); // lấy user và refresh để cập nhật sau logout

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      await refresh(); // cập nhật context => user=null
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <img
                src="/images/Logo Capyvivu - Thiết kế mới với bản đồ.jpg"
                alt="Capyvivu Logo"
                className={styles.logoImage}
              />
              <span className={styles.logoText}>Capyvivu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navigation}>
            <Link href="/destinations" className={styles.navLink}>
              Điểm đến
            </Link>
            <Link href="/reviews" className={styles.navLink}>
              Đánh giá
            </Link>
            <Link href="/planner" className={styles.navLink}>
              Lập kế hoạch
            </Link>
            <Link href="/products" className={styles.navLink}>
              Sản phẩm
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
            <Link href="/community" className={styles.navLink}>
              Cộng đồng
            </Link>
            <Link href="/search" className={styles.navLink}>
              Tìm kiếm
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className={styles.userMenu}>
            {user ? (
              <>
                <span className={styles.username}>
                  Xin chào, {user.fullname}
                </span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.loginButton}>
                  Đăng nhập
                </Link>
                <Link href="/register" className={styles.registerButton}>
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`${styles.mobileMenuBtn} ${isOpen ? styles.open : ""}`}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div id="mobile-navigation" className={styles.mobileNav}>
            <Link href="/destinations" className={styles.navLink}>
              Điểm đến
            </Link>
            <Link href="/reviews" className={styles.navLink}>
              Đánh giá
            </Link>
            <Link href="/planner" className={styles.navLink}>
              Lập kế hoạch
            </Link>
            <Link href="/products" className={styles.navLink}>
              Sản phẩm
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
            <Link href="/community" className={styles.navLink}>
              Cộng đồng
            </Link>
            <Link href="/search" className={styles.navLink}>
              Tìm kiếm
            </Link>

            <div className={styles.mobileUserMenu}>
              {user ? (
                <>
                  <span className={styles.mobileUsername}>{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className={styles.mobileLogoutButton}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.mobileLogin}>
                    Đăng nhập
                  </Link>
                  <Link href="/register" className={styles.mobileRegister}>
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
