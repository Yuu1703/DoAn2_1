import Link from "next/link";
import { useMobileMenu } from "../hooks/useMobileMenu";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { isOpen, toggleMenu } = useMobileMenu();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>VJ</div>
              <span className={styles.logoText}>VietJourney</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navigation}>
            <Link href="#destinations" className={styles.navLink}>
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
            <Link href="/login" className={styles.loginButton}>
              Đăng nhập
            </Link>
            <Link href="/register" className={styles.registerButton}>
              Đăng ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuBtn} ${isOpen ? styles.open : ""}`}
            onClick={toggleMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className={styles.mobileNav}>
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
              <Link href="/login" className={styles.mobileLogin}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.mobileRegister}>
                Đăng ký
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
