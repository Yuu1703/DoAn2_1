import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DetailPost from "../components/post/DetailPostform";
import styles from "../styles/DetailPost.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { id } = router.query; // Lấy ID từ URL query: /DeitalPost?id=xxx

  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Đợi router ready
    if (!router.isReady) {
      return;
    }

    // Nếu không có ID trong URL
    if (!id) {
      setLoading(false);
      setError("Thiếu ID bài viết trong URL");
      return;
    }

    // Lưu postId ngay lập tức
    setPostId(id);

    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching post with ID:", id);

        const res = await fetch(
          `/api/posts/get-by-id?id=${encodeURIComponent(id)}`
        );

        console.log("📡 API response status:", res.status);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Không thể tải bài viết");
        }

        const json = await res.json();

        console.log("✅ API response:", json);

        if (json.ok && json.data) {
          setPost(json.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }

        // ❌ KHÔNG XÓA ID khỏi URL nữa - để giữ ID khi reload
        // router.replace(router.pathname, undefined, { shallow: true });
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [router.isReady, id]); // Re-run khi router ready hoặc id thay đổi

  return (
    <>
      <Head>
        <title>
          {post?.title
            ? `${post.title} - VietJourney`
            : "Chi tiết địa điểm - VietJourney"}
        </title>
        <meta
          name="description"
          content={
            post?.description ||
            "Xem thông tin địa điểm, hình ảnh, tiện ích và đánh giá chi tiết trên VietJourney."
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {post?.images?.[0] && (
          <meta property="og:image" content={post.images[0]} />
        )}
      </Head>

      <Header />

      <main className={styles.mainWrapper}>
        {loading && (
          <div className={styles.emptyBox}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
            <div>Đang tải chi tiết bài viết...</div>
            {postId && (
              <div
                style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}
              >
                ID: {postId}
              </div>
            )}
          </div>
        )}

        {error && (
          <div
            className={styles.emptyBox}
            style={{
              borderColor: "#f87171",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>❌</div>
            <div>Lỗi: {error}</div>
            {postId && (
              <div style={{ fontSize: "12px", marginTop: "8px" }}>
                ID: {postId}
              </div>
            )}
            <button
              onClick={() => router.push("/")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#3949ab",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ← Quay về trang chủ
            </button>
          </div>
        )}

        {!loading && !error && post && (
          <DetailPost post={post} postId={postId || id} />
        )}

        {!loading && !error && !post && (
          <div className={styles.emptyBox}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <div>Không tìm thấy bài viết</div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
