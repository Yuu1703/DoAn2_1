/**
 * Header Component - Thanh header của ứng dụng
 */

import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/">
              <div className={styles.logoIcon}>D</div>
              <span className={styles.logoText}>DoAn2_3</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Trang chủ
            </Link>
            <Link href="/about" className={styles.navLink}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
          </nav>

          {/* User Menu */}
          <div className={styles.userMenu}>
            <button className={styles.loginButton}>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
