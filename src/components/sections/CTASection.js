import styles from "@/styles/CTASection.module.css";
import { MapPin, Users, Calendar } from "lucide-react";

const features = [
  {
    icon: <MapPin size={28} />,
    title: "Khám phá",
    description: "Tìm hiểu về hàng nghìn địa điểm du lịch tuyệt vời",
  },
  {
    icon: <Users size={28} />,
    title: "Chia sẻ",
    description: "Kết nối với cộng đồng và chia sẻ trải nghiệm",
  },
  {
    icon: <Calendar size={28} />,
    title: "Lập kế hoạch",
    description: "Tạo lịch trình hoàn hảo cho chuyến đi của bạn",
  },
];

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Title */}
        <h2 className={styles.title}>Bắt đầu hành trình khám phá Việt Nam</h2>
        <p className={styles.subtitle}>
          Tham gia cộng đồng VietJourney ngay hôm nay và khám phá vẻ đẹp Việt
          Nam cùng hàng nghìn du khách khác
        </p>

        {/* Features */}
        <div className={styles.grid}>
          {features.map((f, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={styles.cta}>
          <a href="/register" className={styles.button}>
            Đăng ký miễn phí ngay
          </a>
          <p className={styles.note}>Miễn phí 100% • Không cần thẻ tín dụng</p>
        </div>
      </div>
    </section>
  );
}
