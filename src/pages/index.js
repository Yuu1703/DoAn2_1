import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Trang chủ - DoAn2_3</title>
        <meta name="description" content="Trang chủ của ứng dụng DoAn2_3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Chào mừng đến với <span className={styles.highlight}>DoAn2_3</span>
          </h1>
          
          <p className={styles.description}>
            Ứng dụng web hiện đại được xây dựng bằng Next.js và Tailwind CSS
          </p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>Tính năng 1</h2>
              <p>Mô tả tính năng đầu tiên của ứng dụng</p>
            </div>

            <div className={styles.card}>
              <h2>Tính năng 2</h2>
              <p>Mô tả tính năng thứ hai của ứng dụng</p>
            </div>

            <div className={styles.card}>
              <h2>Tính năng 3</h2>
              <p>Mô tả tính năng thứ ba của ứng dụng</p>
            </div>

            <div className={styles.card}>
              <h2>Tính năng 4</h2>
              <p>Mô tả tính năng thứ tư của ứng dụng</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
