import styles from "@/styles/Home.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Khám phá Việt Nam{" "}
            <span className={styles.highlight}>cùng cộng đồng</span>
          </h1>
          <p className={styles.subtitle}>
            Chia sẻ trải nghiệm, khám phá địa điểm mới và lập kế hoạch cho
            chuyến đi hoàn hảo của bạn
          </p>

          <div className={styles.actions}>
            <a href="/explore" className={styles.primaryBtn}>
              Khám phá ngay
            </a>
            <a href="/community" className={styles.secondaryBtn}>
              Tham gia cộng đồng
            </a>
          </div>

          <div className={styles.stats}>
            <div>
              <h2>1000+</h2>
              <p>Địa điểm</p>
            </div>
            <div>
              <h2>5000+</h2>
              <p>Đánh giá</p>
            </div>
            <div>
              <h2>2000+</h2>
              <p>Thành viên</p>
            </div>
            <div>
              <h2>500+</h2>
              <p>Kế hoạch</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
