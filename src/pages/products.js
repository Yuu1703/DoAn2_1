import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Products.module.css';

export default function Products() {
  return (
    <>
      <Head>
        <title>Sản phẩm - DoAn2_3</title>
        <meta name="description" content="Các sản phẩm chất lượng của chúng tôi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Sản phẩm của chúng tôi</h1>
          
          <div className={styles.productsGrid}>
            {/* Product Card 1 */}
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <div className={styles.imagePlaceholder}>📱</div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>iPhone App</h3>
                <p className={styles.productDescription}>
                  Ứng dụng mobile hiện đại cho iOS
                </p>
                <div className={styles.productPrice}>$299</div>
                <button className={styles.buyButton}>Mua ngay</button>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <div className={styles.imagePlaceholder}>🌐</div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>Website Template</h3>
                <p className={styles.productDescription}>
                  Template website responsive đẹp mắt
                </p>
                <div className={styles.productPrice}>$199</div>
                <button className={styles.buyButton}>Mua ngay</button>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <div className={styles.imagePlaceholder}>⚡</div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>Web App</h3>
                <p className={styles.productDescription}>
                  Ứng dụng web đầy đủ tính năng
                </p>
                <div className={styles.productPrice}>$499</div>
                <button className={styles.buyButton}>Mua ngay</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
