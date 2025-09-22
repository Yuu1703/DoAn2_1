import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>Giới thiệu - DoAn2_3</title>
        <meta name="description" content="Trang giới thiệu về ứng dụng DoAn2_3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Giới thiệu về DoAn2_3</h1>
          
          <div className={styles.content}>
            <section className={styles.section}>
              <h2>Về chúng tôi</h2>
              <p>
                DoAn2_3 là một ứng dụng web hiện đại được phát triển bằng Next.js, 
                một framework React mạnh mẽ. Chúng tôi cam kết mang đến trải nghiệm 
                người dùng tốt nhất với giao diện thân thiện và hiệu suất cao.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Sứ mệnh</h2>
              <p>
                Sứ mệnh của chúng tôi là tạo ra những giải pháp công nghệ đột phá, 
                giúp người dùng làm việc hiệu quả hơn và tận hưởng cuộc sống tốt đẹp hơn.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Công nghệ sử dụng</h2>
              <ul className={styles.techList}>
                <li>Next.js 15 - Framework React hiện đại</li>
                <li>JavaScript ES6+ - Ngôn ngữ lập trình</li>
                <li>Tailwind CSS - Framework CSS tiện ích</li>
                <li>Responsive Design - Thiết kế đáp ứng</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
