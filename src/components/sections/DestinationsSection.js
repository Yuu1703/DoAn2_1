import styles from "@/styles/DestinationsSection.module.css";
import { MapPin, Star } from "lucide-react";

const destinations = [
  {
    id: 1,
    image: "/home/halong.jpg", // ảnh trong public/home
    location: "Quảng Ninh",
    name: "Vịnh Hạ Long",
    description: "Di sản thế giới với hàng nghìn đảo đá vôi tuyệt đẹp",
    reviews: 1234,
    rating: 4.8,
  },
  {
    id: 2,
    image: "/home/hoian.jpg",
    location: "Quảng Nam",
    name: "Hội An",
    description: "Phố cổ với kiến trúc độc đáo và đèn lồng rực rỡ",
    reviews: 987,
    rating: 4.9,
  },
  {
    id: 3,
    image: "/home/sapa.jpg",
    location: "Lào Cai",
    name: "Sapa",
    description: "Ruộng bậc thang hùng vĩ và văn hóa dân tộc đặc sắc",
    reviews: 756,
    rating: 4.7,
  },
  {
    id: 4,
    image: "/home/phuquoc.jpg",
    location: "Kiên Giang",
    name: "Phú Quốc",
    description: "Đảo ngọc với bãi biển trắng và nước biển trong xanh",
    reviews: 543,
    rating: 4.6,
  },
];

export default function DestinationsSection() {
  return (
    <section id="destinations" className={styles.section}>
      {" "}
      {/* 👈 thêm id */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Điểm đến nổi bật</h2>
            <p className={styles.subtitle}>
              Khám phá những địa điểm du lịch được yêu thích nhất tại Việt Nam
            </p>
          </div>
          <a href="/destinations" className={styles.viewAll}>
            Xem tất cả →
          </a>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {destinations.map((d) => (
            <div key={d.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={d.image} alt={d.name} className={styles.image} />
                <div className={styles.rating}>
                  <Star className={styles.star} />
                  {d.rating}
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.location}>
                  <MapPin className={styles.pin} />
                  {d.location}
                </p>
                <h3 className={styles.name}>{d.name}</h3>
                <p className={styles.description}>{d.description}</p>
                <p className={styles.reviews}>{d.reviews} đánh giá</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
