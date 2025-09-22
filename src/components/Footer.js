/**
 * Footer Component - Phần footer của ứng dụng
 */

import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>DoAn2_3</h3>
            <p className={styles.companyDescription}>
              Ứng dụng web hiện đại được xây dựng bằng Next.js
            </p>
            <p className={styles.copyright}>
              © 2025 DoAn2_3. Tất cả quyền được bảo lưu.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Liên kết nhanh</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="/" className={styles.link}>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/about" className={styles.link}>
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/contact" className={styles.link}>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Liên hệ</h4>
            <ul className={styles.contactList}>
              <li>Email: contact@doan23.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Address: Việt Nam</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
