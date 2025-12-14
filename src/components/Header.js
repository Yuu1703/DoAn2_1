import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMobileMenu } from "../hooks/useMobileMenu";
import { useUser } from "@/context/UserContext"; // import context
import styles from "@/styles/Header.module.css";

export default function Header() {
  const router = useRouter();
  const { isOpen, toggleMenu } = useMobileMenu();
  const { user, refresh } = useUser(); // lấy user và refresh để cập nhật sau logout
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Đóng dropdown khi click ra ngoài hoặc nhấn ESC
  useEffect(() => {
    function onClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setAccountOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      await refresh(); // cập nhật context => user=null
      // Điều hướng về trang đăng nhập sau khi đăng xuất
      router.replace("/login");
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
            <Link href="/products" className={styles.navLink}>
              Sản phẩm
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
            <Link href="/DeitalPost" className={styles.navLink}>
              Cộng đồng
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className={styles.userMenu}>
            {user ? (
              <div className={styles.accountWrapper} ref={accountRef}>
                <button
                  type="button"
                  className={styles.avatarButton}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((v) => !v)}
                  title={user.fullname || user.username}
                >
                  <span className={styles.avatarIcon} aria-hidden>
                    {/* Hiển thị chữ cái đầu làm avatar fallback */}
                    {(user.fullname || user.username || "?")
                      .toString()
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  {user.warnings > 0 && (
                    <span className={styles.warningBadge}>{user.warnings}</span>
                  )}
                </button>
                {accountOpen && (
                  <div className={styles.dropdown} role="menu">
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>
                        {user.fullname || user.username}
                      </div>
                      {user.email && (
                        <div className={styles.userEmail}>{user.email}</div>
                      )}
                    </div>
                    {user.warnings > 0 && (
                      <div className={styles.warningNotification}>
                        <div className={styles.warningIcon}>⚠️</div>
                        <div className={styles.warningContent}>
                          <div className={styles.warningTitle}>Cảnh báo từ Admin</div>
                          <div className={styles.warningText}>
                            Bạn đã bị cảnh báo {user.warnings} lần. Vui lòng tuân thủ quy định cộng đồng.
                          </div>
                        </div>
                      </div>
                    )}
                    <Link
                      href="/profile"
                      className={styles.menuItem}
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      Xem thông tin
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className={styles.menuItem}
                        role="menuitem"
                        onClick={() => setAccountOpen(false)}
                      >
                        🛡️ Admin Dashboard
                      </Link>
                    )}
                    <button
                      className={styles.menuItemDanger}
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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
            <Link href="/products" className={styles.navLink}>
              Sản phẩm
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
            <Link href="/Postform" className={styles.navLink}>
              Cộng đồng
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
