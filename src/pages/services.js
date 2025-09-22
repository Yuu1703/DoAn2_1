import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Services.module.css';

export default function Services() {
  return (
    <>
      <Head>
        <title>Dịch vụ - DoAn2_3</title>
        <meta name="description" content="Các dịch vụ mà chúng tôi cung cấp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Dịch vụ của chúng tôi</h1>
          
          <div className={styles.servicesGrid}>
            {/* Service Card 1 */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🌐</div>
              <h3 className={styles.serviceTitle}>Thiết kế Website</h3>
              <p className={styles.serviceDescription}>
                Thiết kế website responsive, hiện đại và tối ưu SEO
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Responsive design</li>
                <li>SEO friendly</li>
                <li>Tối ưu tốc độ</li>
              </ul>
            </div>

            {/* Service Card 2 */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📱</div>
              <h3 className={styles.serviceTitle}>Ứng dụng Mobile</h3>
              <p className={styles.serviceDescription}>
                Phát triển ứng dụng mobile cho iOS và Android
              </p>
              <ul className={styles.serviceFeatures}>
                <li>React Native</li>
                <li>Cross-platform</li>
                <li>Performance cao</li>
              </ul>
            </div>

            {/* Service Card 3 */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>⚡</div>
              <h3 className={styles.serviceTitle}>Web App</h3>
              <p className={styles.serviceDescription}>
                Xây dựng ứng dụng web hiện đại với Next.js
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Next.js</li>
                <li>Server-side rendering</li>
                <li>Real-time features</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className={styles.cta}>
            <h2>Bạn cần hỗ trợ?</h2>
            <p>Liên hệ với chúng tôi để được tư vấn miễn phí</p>
            <a href="/contact" className={styles.ctaButton}>
              Liên hệ ngay
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
