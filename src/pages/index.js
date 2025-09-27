import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import DestinationsSection from "../components/sections/DestinationsSection";
import CTASection from "../components/sections/CTASection"; // 👈 Thêm mới

export default function Home() {
  return (
    <>
      <Head>
        <title>Capyvivu - Khám phá Việt Nam cùng cộng đồng</title>
        <meta
          name="description"
          content="Chia sẻ trải nghiệm, khám phá địa điểm mới và lập kế hoạch cho chuyến đi hoàn hảo của bạn"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />
        <DestinationsSection />
        <CTASection /> {/* 👈 Section mới */}
      </main>

      <Footer />
    </>
  );
}
