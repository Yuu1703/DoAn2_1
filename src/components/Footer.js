import styles from "@/styles/Footer.module.css";
import { MapPin, Facebook, Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left: Logo + intro */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <MapPin size={20} />
            <span className={styles.logoText}>VietJourney</span>
          </div>
          <p className={styles.description}>
            Nền tảng chia sẻ và lập kế hoạch du lịch Việt Nam. Khám phá vẻ đẹp
            đất nước cùng cộng đồng du lịch sôi động.
          </p>
          <div className={styles.socials}>
            <a href="#">
              <Facebook size={20} />
            </a>
            <a href="#">
              <Instagram size={20} />
            </a>
            <a href="#">
              <Youtube size={20} />
            </a>
            <a href="#">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className={styles.links}>
          <h4>Liên kết nhanh</h4>
          <ul>
            <li>
              <a href="#">Điểm đến</a>
            </li>
            <li>
              <a href="#">Đánh giá</a>
            </li>
            <li>
              <a href="#">Lập kế hoạch</a>
            </li>
            <li>
              <a href="#">Cộng đồng</a>
            </li>
          </ul>
        </div>

        {/* Right: Support */}
        <div className={styles.links}>
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <a href="#">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
            <li>
              <a href="#">Điều khoản</a>
            </li>
            <li>
              <a href="#">Bảo mật</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© 2025 VietJourney. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
