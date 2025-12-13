import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import DetailPost from "@/components/DetailPost";
import Head from "next/head";

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query; // ID từ URL: /post/693abf49b62f880187f843ef

  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post khi có ID từ URL
  useEffect(() => {
    // Đợi router ready
    if (!router.isReady) {
      return;
    }

    // Nếu không có ID trong URL
    if (!id) {
      setLoading(false);
      setError("Thiếu ID bài viết");
      return;
    }

    // Lưu postId ngay lập tức
    setPostId(id);

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching post with ID:", id);

        // Gọi API endpoint hiện tại của bạn
        const res = await fetch(`/api/posts/get-by-id?id=${id}`);

        console.log("📡 API response status:", res.status);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Không tìm thấy bài viết");
          }
          throw new Error(`Lỗi tải dữ liệu: ${res.status}`);
        }

        const json = await res.json();

        console.log("✅ API response:", json);

        if (json.ok && json.data) {
          setPost(json.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [router.isReady, id]); // Chạy lại khi router ready hoặc id thay đổi

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Đang tải...</title>
        </Head>
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "30px",
              border: "1px dashed #ccc",
              borderRadius: "10px",
              color: "#777",
              fontSize: "16px",
            }}
          >
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
        </div>
      </>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <>
        <Head>
          <title>Lỗi</title>
        </Head>
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "30px",
              border: "1px solid #f87171",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontSize: "16px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>❌</div>
            <div>{error || "Không tìm thấy bài viết"}</div>
            {postId && (
              <div style={{ fontSize: "12px", marginTop: "8px" }}>
                ID: {postId}
              </div>
            )}
          </div>
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
      </>
    );
  }

  // Success state - render DetailPost
  return (
    <>
      <Head>
        <title>{post.title || "Chi tiết bài viết"}</title>
        <meta name="description" content={post.description || ""} />
        <meta property="og:title" content={post.title || ""} />
        <meta property="og:description" content={post.description || ""} />
        {post.images && post.images[0] && (
          <meta property="og:image" content={post.images[0]} />
        )}
      </Head>
      <DetailPost post={post} postId={postId || id} />
    </>
  );
}
