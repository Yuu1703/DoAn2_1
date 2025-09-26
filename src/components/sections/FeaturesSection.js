import styles from "@/styles/FeaturesSection.module.css";
import {
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Camera,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <MapPin className={styles.icon} />,
    title: "Khám phá địa điểm",
    description:
      "Tìm hiểu về hàng nghìn địa điểm du lịch tuyệt vời khắp Việt Nam với thông tin chi tiết và hình ảnh chân thực.",
  },
  {
    icon: <Star className={styles.icon} />,
    title: "Đánh giá chân thực",
    description:
      "Đọc và chia sẻ những trải nghiệm thực tế từ cộng đồng du lịch Việt Nam.",
  },
  {
    icon: <Calendar className={styles.icon} />,
    title: "Lập kế hoạch thông minh",
    description:
      "Tạo lịch trình chi tiết cho chuyến đi với công cụ lập kế hoạch dễ sử dụng.",
  },
  {
    icon: <DollarSign className={styles.icon} />,
    title: "Tính toán chi phí",
    description:
      "Dự toán chính xác chi phí cho chuyến đi của bạn với công cụ tính toán thông minh.",
  },
  {
    icon: <Camera className={styles.icon} />,
    title: "Chia sẻ khoảnh khắc",
    description:
      "Lưu giữ và chia sẻ những khoảnh khắc đẹp nhất trong chuyến đi của bạn.",
  },
  {
    icon: <Users className={styles.icon} />,
    title: "Cộng đồng sôi động",
    description:
      "Kết nối với những người yêu du lịch và trao đổi kinh nghiệm, mẹo hay.",
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Tại sao chọn VietJourney?</h2>
        <p className={styles.subheading}>
          Chúng tôi cung cấp mọi thứ bạn cần để có một chuyến du lịch Việt Nam
          hoàn hảo
        </p>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
