import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DetailPost from "../components/post/DetailPostform";
import styles from "../styles/DetailPost.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/posts/get-by-id?id=${encodeURIComponent(id)}`
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to fetch post");
        }

        const json = await res.json();
        setPost(json.data || null);

        // Remove post id from URL to avoid exposing it in address bar
        try {
          router.replace(router.pathname, undefined, { shallow: true });
        } catch (e) {
          /* ignore */
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPost();
  }, [router.isReady, id]);

  return (
    <>
      <Head>
        <title>Chi tiết địa điểm - VietJourney</title>
        <meta
          name="description"
          content="Xem thông tin địa điểm, hình ảnh, tiện ích và đánh giá chi tiết trên VietJourney."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={styles.mainWrapper}>
        {loading && <div className={styles.emptyBox}>Đang tải...</div>}
        {error && <div className={styles.emptyBox}>Lỗi: {error}</div>}
        {!loading && !error && <DetailPost post={post} postId={id} />}
      </main>

      <Footer />
    </>
  );
}
