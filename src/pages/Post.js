import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostForm from "../components/post/Postform";
import styles from "../styles/PostForm.module.css";
import { useUser } from "@/context/UserContext";

export default function CreatePost() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  return (
    <>
      <Head>
        <title>Đăng bài địa điểm du lịch - VietJourney</title>
        <meta
          name="description"
          content="Chia sẻ địa điểm du lịch yêu thích của bạn với cộng đồng VietJourney. Đăng ảnh, review và giúp mọi người khám phá Việt Nam"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {loading ? (
            <div>Đang kiểm tra đăng nhập...</div>
          ) : user ? (
            <PostForm />
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
