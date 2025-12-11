import { useState, useEffect } from "react";
import styles from "@/styles/DetailPost.module.css";
import { useUser } from "@/context/UserContext";

/* =========================================================
   CATEGORY → SUBCATEGORY → LABEL MAPPING
   ========================================================= */
const CATEGORY_MAP = {
  restaurant: [
    { value: "vietnamese", label: "Món Việt" },
    { value: "street-food", label: "Street Food" },
    { value: "fine-dining", label: "Cao cấp" },
    { value: "budget", label: "Giá rẻ" },
  ],
  cafe: [
    { value: "coffee", label: "Café" },
    { value: "rooftop", label: "Rooftop" },
    { value: "view", label: "View đẹp" },
    { value: "bar", label: "Bar" },
  ],
  resort: [
    { value: "beach", label: "Gần biển" },
    { value: "luxury", label: "Luxury" },
    { value: "family", label: "Gia đình" },
    { value: "honeymoon", label: "Honeymoon" },
  ],
  homestay: [
    { value: "mountain-view", label: "View núi" },
    { value: "ethnic-culture", label: "Văn hóa dân tộc" },
    { value: "local-experience", label: "Trải nghiệm thực tế" },
  ],
  hotel: [
    { value: "budget", label: "Budget" },
    { value: "mid-range", label: "Mid-range" },
    { value: "luxury", label: "Luxury" },
    { value: "beach", label: "Gần biển" },
  ],
  entertainment: [
    { value: "theme-park", label: "Công viên giải trí" },
    { value: "cinema", label: "Rạp chiếu phim" },
    { value: "museum", label: "Bảo tàng" },
    { value: "activity", label: "Hoạt động vui chơi" },
  ],
  shopping: [
    { value: "mall", label: "Trung tâm thương mại" },
    { value: "local-market", label: "Chợ địa phương" },
    { value: "souvenir", label: "Quà lưu niệm" },
  ],
  spa: [
    { value: "massage", label: "Massage" },
    { value: "beauty", label: "Làm đẹp" },
    { value: "relax", label: "Thư giãn" },
  ],
  nightlife: [
    { value: "pub", label: "Pub" },
    { value: "bar", label: "Bar" },
    { value: "club", label: "Club" },
  ],
  "vehicle-rental": [
    { value: "car", label: "Thuê xe hơi" },
    { value: "motorbike", label: "Thuê xe máy" },
    { value: "bike", label: "Thuê xe đạp" },
  ],
};

// Helper: convert value → label
function getLabel(category, subcategory) {
  const catKey = category?.toLowerCase();
  const subKey = subcategory?.toLowerCase();
  const list = CATEGORY_MAP[catKey];
  if (!list) return { catLabel: category, subLabel: subcategory };

  const found = list.find((x) => x.value === subKey);
  return {
    catLabel: category,
    subLabel: found ? found.label : subcategory,
  };
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function DetailPost({ post, postId }) {
  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyBox}>Đang tải chi tiết...</div>
      </div>
    );
  }

  const {
    title = "",
    region = "",
    province = "",
    address = "",
    category = "",
    subcategory = "",
    priceRange = "",
    description = "",
    images = [],
    amenities = [],
    openingHours = "",
    phoneNumber = "",
    website = "",
    ratings = null,
    authorName = "",
  } = post || {};

  const { user } = useUser();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [comments, setComments] = useState([]);

  const [ratingsObj, setRatingsObj] = useState(
    post?.ratings && typeof post.ratings === "object" ? post.ratings : {}
  );
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setHasRated(Boolean(ratingsObj?.[String(user.id)]));
    }
  }, [user, ratingsObj]);

  const ratingValues = Object.values(ratingsObj || {}).map(Number);
  const ratingCount = ratingValues.length;
  const ratingAvg =
    ratingCount > 0
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingCount).toFixed(1)
      : null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
    setUploadedImages(files);
  };

  const openLightbox = (i = 0) => {
    setCurrentImageIndex(i);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = () =>
    setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1));

  const showNext = () =>
    setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  /* =========================================================
     LOAD COMMENTS
     ========================================================= */
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const id =
          postId || post?.id || post?._id || post?._id?.toString() || "";
        if (!id) return;

        const res = await fetch(`/api/comments?postId=${id}`);
        if (!res.ok) throw new Error("Load comments failed");

        const json = await res.json();
        if (active) setComments(json.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [post, postId]);

  /* =========================================================
     SUBMIT COMMENT
     ========================================================= */
  const handleSubmitComment = async () => {
    if (!user?.id) return alert("Bạn cần đăng nhập");

    if (!comment.trim()) return alert("Bạn chưa nhập nội dung");

    try {
      const form = new FormData();
      const _pid = post?.id || post?._id || post?._id?.toString();
      form.append("postId", String(_pid));
      form.append("text", comment);
      uploadedImages.forEach((f) => form.append("images", f));

      const res = await fetch(`/api/comments/create`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi gửi bình luận");

      setComments((p) => [json.data, ...p]);
      setComment("");
      setPreviewImages([]);
      setUploadedImages([]);
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================================================
     SUBMIT RATING
     ========================================================= */
  const handleSubmitRating = async (value) => {
    if (!user?.id) return alert("Bạn cần đăng nhập");

    if (hasRated) return alert("Bạn đã đánh giá trước đó");

    try {
      const pid = post?.id || post?._id;

      const res = await fetch(`/api/posts/add-rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: String(pid), rating: value }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      const next = { ...ratingsObj, [user.id]: value };
      setRatingsObj(next);
      setHasRated(true);
      setSelectedRating(value);
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================================================
     LABELS MAPPING
     ========================================================= */
  const { catLabel, subLabel } = getLabel(category, subcategory);

  return (
    <div className={styles.container}>
      {/* ===================== GALLERY ===================== */}
      <div className={styles.gallery}>
        {images.length ? (
          <>
            <div
              className={styles.mainImageWrap}
              onClick={() => openLightbox(currentImageIndex)}
            >
              <img
                className={styles.mainImage}
                src={images[currentImageIndex]}
                alt=""
              />
            </div>

            <div className={styles.thumbsWrap}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumbButton} ${
                    i === currentImageIndex ? styles.thumbActive : ""
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>

            {lightboxOpen && (
              <div className={styles.lightbox} onClick={closeLightbox}>
                <button className={styles.lightboxClose}>×</button>
                <button
                  className={styles.lightboxPrev}
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                >
                  ‹
                </button>
                <img
                  className={styles.lightboxImage}
                  src={images[currentImageIndex]}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className={styles.lightboxNext}
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyBox}>Không có hình ảnh</div>
        )}
      </div>

      {/* ===================== HEADER ===================== */}
      <div className={styles.header}>
        <div className={styles.category}>
          <span className={styles.icon}>📍</span>
          <span>{subLabel || "Danh mục"}</span>
        </div>

        <h1 className={styles.title}>{title}</h1>

        {/* Category Tags */}
        <div className={styles.metaTags}>
          <span className={styles.metaTag}>🏷️ {catLabel || "—"}</span>
          <span className={styles.metaTag}>🧭 {subLabel || "—"}</span>
        </div>

        <div className={styles.ratings}>
          {ratingAvg
            ? `★ ${ratingAvg} / 5 (${ratingCount} đánh giá)`
            : "★ Chưa có đánh giá"}
        </div>

        {authorName && (
          <div style={{ fontSize: 14, marginTop: 4 }}>
            Tác giả: {authorName}
          </div>
        )}
      </div>

      {/* ===================== INFO ===================== */}
      <div className={styles.infoSection}>
        <div className={styles.infoRow}>
          <strong>🗺️ Khu vực:</strong> {region}
        </div>
        <div className={styles.infoRow}>
          <strong>📌 Tỉnh/TP:</strong> {province}
        </div>
        <div className={styles.infoRow}>
          <strong>📍 Địa chỉ:</strong> {address}
        </div>
        <div className={styles.infoRow}>
          <strong>💰 Giá:</strong> {priceRange}
        </div>
        {phoneNumber && (
          <div className={styles.infoRow}>
            <strong>📞 SĐT:</strong> {phoneNumber}
          </div>
        )}
        {openingHours && (
          <div className={styles.infoRow}>
            <strong>🕐 Giờ mở cửa:</strong> {openingHours}
          </div>
        )}
        {website && (
          <div className={styles.infoRow}>
            <strong>🌐 Website:</strong> {website}
          </div>
        )}
      </div>

      {/* ===================== DESCRIPTION ===================== */}
      <div className={styles.section}>
        <h2>Mô tả</h2>
        <p>{description}</p>
      </div>

      {/* ===================== AMENITIES ===================== */}
      {amenities.length > 0 && (
        <div className={styles.section}>
          <h2>Tiện ích</h2>
          <div className={styles.amenities}>
            {amenities.map((a, i) => (
              <span key={i} className={styles.amenityTag}>
                ✓ {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===================== COMMENTS ===================== */}
      <div className={styles.section}>
        <h2>Đánh giá & Bình luận</h2>

        {/* COMMENT FORM */}
        <div className={styles.commentForm}>
          <h3>Viết đánh giá của bạn</h3>

          <div className={styles.ratingInput}>
            <strong>
              Điểm trung bình:{" "}
              {ratingAvg
                ? `${ratingAvg} / 5 (${ratingCount} đánh giá)`
                : "Chưa có đánh giá"}
            </strong>

            {!hasRated ? (
              [1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.star}
                  onClick={() => handleSubmitRating(star)}
                  style={{
                    color: selectedRating >= star ? "#FFD700" : "#ccc",
                    cursor: "pointer",
                  }}
                >
                  ★
                </span>
              ))
            ) : (
              <div>Bạn đã đánh giá</div>
            )}
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* UPLOAD IMAGES */}
          <div className={styles.uploadBox}>
            <label className={styles.uploadLabel}>
              Tải ảnh lên
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className={styles.uploadInput}
              />
            </label>

            <div className={styles.previewImages}>
              {previewImages.map((src, i) => (
                <img key={i} src={src} alt="preview" />
              ))}
            </div>
          </div>

          <button className={styles.submitButton} onClick={handleSubmitComment}>
            Gửi đánh giá
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className={styles.commentList}>
          {comments.length ? (
            comments.map((cmt, i) => (
              <div key={i} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <strong>{cmt.authorName || "Người dùng"}</strong>
                  <small>
                    {cmt.createdAt
                      ? new Date(cmt.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>

                <p className={styles.commentText}>{cmt.text}</p>

                {cmt.images && (
                  <div className={styles.commentImages}>
                    {cmt.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyBox}>Chưa có bình luận</div>
          )}
        </div>
      </div>
    </div>
  );
}
// End of DetailPost component
