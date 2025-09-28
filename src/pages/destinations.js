import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchHeroSection from "../components/destinations/SearchHeroSection";
import FilterSidebarSection from "../components/destinations/FilterSidebarSection";
import ProductsDisplaySection from "../components/destinations/ProductsDisplaySection";
import styles from "../styles/DestinationsMain.module.css";

export default function Destinations() {
  return (
    <>
      <Head>
        <title>Điểm đến du lịch - VietJourney</title>
        <meta name="description" content="Khám phá hơn 200+ địa điểm du lịch tuyệt vời tại Việt Nam với đánh giá chân thực từ cộng đồng VietJourney" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      
      <SearchHeroSection />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <FilterSidebarSection />
          <ProductsDisplaySection />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
