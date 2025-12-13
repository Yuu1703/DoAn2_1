import { useState, useEffect } from "react";
import styles from "@/styles/DetailPost.module.css";
import { useUser } from "@/context/UserContext";
import LoginNotification from "@/components/common/LoginNotification";

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
  const authorId = post?.authorId || post?.author || null;
  const canEdit = Boolean(
    user?.id && authorId && String(user.id) === String(authorId)
  );
  const editTargetId =
    postId || post?.id || post?._id || post?._id?.toString() || "";

  const [showLoginNotification, setShowLoginNotification] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPreviewImages, setEditPreviewImages] = useState([]);
  const [editUploadedImages, setEditUploadedImages] = useState([]);

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
    if (!user?.id) {
      setShowLoginNotification(true);
      return;
    }

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

      // Thêm userId vào comment mới để hiển thị nút sửa/xóa ngay lập tức
      const newComment = {
        ...json.data,
        userId: String(user.id), // Thêm userId
        _id: json.data.id, // Đảm bảo có _id
      };

      setComments((p) => [newComment, ...p]);
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
    if (!user?.id) {
      setShowLoginNotification(true); // bật thông báo khi click sao mà chưa login
      return;
    }

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

  // Handler xóa comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const pid = post?.id || post?._id || post?._id?.toString();
      const res = await fetch(`/api/comments/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, postId: pid }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi xóa bình luận");

      // Xóa comment khỏi danh sách ngay lập tức
      setComments((prev) =>
        prev.filter((c) => String(c._id) !== String(commentId))
      );
      // Xóa alert để UX mượt hơn
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler bắt đầu edit
  const handleStartEdit = (cmt) => {
    setEditingCommentId(String(cmt._id));
    setEditText(cmt.text || "");
    setEditPreviewImages(cmt.images || []);
    setEditUploadedImages([]);
  };

  // Handler hủy edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
    setEditPreviewImages([]);
    setEditUploadedImages([]);
  };

  // Handler upload ảnh khi edit
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setEditPreviewImages((prev) => [...prev, ...newPreviews]);
    setEditUploadedImages((prev) => [...prev, ...files]);
  };

  // Handler xóa ảnh trong edit mode
  const handleRemoveEditImage = (index) => {
    setEditPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler submit update
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return alert("Bạn chưa nhập nội dung");

    try {
      const form = new FormData();
      form.append("commentId", commentId);
      form.append("text", editText);

      // Send existing images that weren't removed
      const existingImages = editPreviewImages.filter(
        (img) => !img.startsWith("blob:")
      );
      form.append("existingImages", JSON.stringify(existingImages));

      // Append new uploaded images
      editUploadedImages.forEach((f) => form.append("images", f));

      const res = await fetch(`/api/comments/update`, {
        method: "PUT",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi cập nhật bình luận");

      // Cập nhật comment trong danh sách ngay lập tức
      setComments((prev) =>
        prev.map((c) =>
          String(c._id) === String(commentId)
            ? {
                ...c,
                text: json.data.text,
                images: json.data.images,
                updatedAt: json.data.updatedAt,
                authorName: json.data.authorName,
              }
            : c
        )
      );

      handleCancelEdit();
      // Xóa alert để UX mượt hơn
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {showLoginNotification && (
        <LoginNotification onClose={() => setShowLoginNotification(false)} />
      )}
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

          {canEdit && editTargetId && (
            <div style={{ marginTop: 8 }}>
              <a
                href={`/post/edit/${encodeURIComponent(String(editTargetId))}`}
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#0ea5e9",
                  color: "white",
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                ✏️ Chỉnh sửa bài đăng
              </a>
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

            <button
              className={styles.submitButton}
              onClick={handleSubmitComment}
            >
              Gửi đánh giá
            </button>
          </div>

          {/* COMMENTS LIST */}
          <div className={styles.commentList}>
            {comments.length ? (
              comments.map((cmt, i) => {
                const isOwner =
                  user?.id && String(cmt.userId) === String(user.id);
                const isEditing = editingCommentId === String(cmt._id);

                return (
                  <div key={i} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <strong>{cmt.authorName || "Người dùng"}</strong>
                      <small>
                        {cmt.createdAt
                          ? new Date(cmt.createdAt).toLocaleString()
                          : ""}
                        {cmt.updatedAt && " (đã chỉnh sửa)"}
                      </small>
                    </div>

                    {isEditing ? (
                      // EDIT MODE
                      <div className={styles.editMode}>
                        <textarea
                          className={styles.textarea}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />

                        <div className={styles.editImages}>
                          {editPreviewImages.map((src, idx) => (
                            <div key={idx} className={styles.editImageWrap}>
                              <img src={src} alt="preview" />
                              <button
                                className={styles.removeImageBtn}
                                onClick={() => handleRemoveEditImage(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className={styles.uploadBox}>
                          <label className={styles.uploadLabel}>
                            Thêm ảnh
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleEditImageUpload}
                              className={styles.uploadInput}
                            />
                          </label>
                        </div>

                        <div className={styles.editActions}>
                          <button
                            className={styles.saveButton}
                            onClick={() => handleUpdateComment(cmt._id)}
                          >
                            Lưu
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      // VIEW MODE
                      <>
                        <p className={styles.commentText}>{cmt.text}</p>

                        {cmt.images && cmt.images.length > 0 && (
                          <div className={styles.commentImages}>
                            {cmt.images.map((img, idx) => (
                              <img key={idx} src={img} alt="" />
                            ))}
                          </div>
                        )}

                        {isOwner && (
                          <div className={styles.commentActions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => handleStartEdit(cmt)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteComment(cmt._id)}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyBox}>Chưa có bình luận</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
