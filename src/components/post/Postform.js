import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import styles from "@/styles/PostForm.module.css";

const PostForm = ({ initialData, onSubmitJson, onSubmitFormData }) => {
  const [formData, setFormData] = useState({
    title: "",
    region: "",
    province: "",
    address: "",
    category: "",
    priceRange: "",
    description: "",
    images: [],
    amenities: [],
    openingHours: "",
    phoneNumber: "",
    website: "",
    subcategory: "",
  });

  // Prefill when initialData provided (edit mode)
  React.useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        images: [], // do not preload files; keep empty
      }));
      // show existing images as previews in edit mode
      try {
        const imgs = Array.isArray(initialData.images) ? initialData.images : [];
        setImagesPreviews(imgs);
      } catch (_) {}
    }
  }, [initialData]);

  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Regions and Provinces data (simplified version)
  const regions = [
    { value: "mien-bac", label: "Miền Bắc", icon: "🏔️" },
    { value: "mien-trung", label: "Miền Trung", icon: "🏖️" },
    { value: "mien-nam", label: "Miền Nam", icon: "🌴" },
  ];

  const provinces = {
    "mien-bac": ["Hà Nội", "Quảng Ninh", "Lào Cai", "Ninh Bình", "Hải Phòng"],
    "mien-trung": [
      "Đà Nẵng",
      "Quảng Nam",
      "Thừa Thiên Huế",
      "Khánh Hòa",
      "Quảng Bình",
    ],
    "mien-nam": [
      "TP.HCM",
      "Kiên Giang",
      "Lâm Đồng",
      "Bà Rịa-Vũng Tàu",
      "Cần Thơ",
    ],
  };

  const categories = [
    { value: "hotel", label: "Khách sạn", icon: "🏨" },
    { value: "resort", label: "Resort", icon: "🏝️" },
    { value: "homestay", label: "Homestay", icon: "🏡" },

    { value: "restaurant", label: "Quán ăn", icon: "🍽️" },
    { value: "cafe", label: "Quán nước & Cafe", icon: "☕" },

    { value: "tourist-attraction", label: "Điểm tham quan", icon: "📸" },
    { value: "entertainment", label: "Địa điểm giải trí", icon: "🎭" },

    { value: "shopping", label: "Mua sắm", icon: "🛍️" },
    { value: "spa", label: "Spa & Làm đẹp", icon: "💆" },
    { value: "nightlife", label: "Cuộc sống về đêm", icon: "🌃" },

    { value: "vehicle-rental", label: "Thuê xe", icon: "🚗" },
  ];
  const subcategoriesByCategory = {
    "tourist-attraction": [
      { value: "nature", label: "Thiên nhiên" },
      { value: "history", label: "Lịch sử" },
      { value: "culture", label: "Văn hóa" },
      { value: "check-in", label: "Check-in" },
    ],

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

  const currentSubcategories = subcategoriesByCategory[formData.category] || [];

  const priceRanges = [
    { value: "budget", label: "$ - Giá rẻ", description: "Dưới 500k" },
    { value: "moderate", label: "$$ - Trung bình", description: "500k - 2tr" },
    { value: "expensive", label: "$$$ - Cao cấp", description: "2tr - 5tr" },
    { value: "luxury", label: "$$$$ - Sang trọng", description: "Trên 5tr" },
  ];

  const amenitiesList = [
    "WiFi miễn phí",
    "Bãi đỗ xe",
    "Điều hòa",
    "Thú cưng",
    "Thanh toán thẻ",
    "Giao hàng",
    "Phòng riêng",
    "Khu vực ngoài trời",
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagesPreviews.length > 10) {
      alert("Bạn chỉ có thể upload tối đa 10 ảnh");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews((prev) => [...prev, reader.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      region: value,
      province: "", // Reset province when region changes
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title ||
      !formData.region ||
      !formData.province ||
      !formData.address ||
      !formData.category
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // In edit mode (onSubmitJson/onSubmitFormData provided), skip image requirement
    if (!onSubmitJson && !onSubmitFormData && imagesPreviews.length === 0) {
      alert("Vui lòng upload ít nhất 1 ảnh");
      return;
    }

    try {
      // If edit mode, prefer multipart FormData for image updates
      if (typeof onSubmitFormData === 'function') {
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("region", formData.region);
        fd.append("province", formData.province);
        fd.append("address", formData.address);
        fd.append("category", formData.category);
        fd.append("priceRange", formData.priceRange || "");
        fd.append("description", formData.description || "");
        fd.append("openingHours", formData.openingHours || "");
        fd.append("phoneNumber", formData.phoneNumber || "");
        fd.append("website", formData.website || "");
        fd.append("amenities", JSON.stringify(formData.amenities || []));
        fd.append("subcategory", formData.subcategory || "");

        formData.images.forEach((file) => fd.append("images", file));

        await onSubmitFormData(fd);
        return;
      }

      // If edit mode without images change, allow JSON PUT
      if (typeof onSubmitJson === 'function') {
        await onSubmitJson({
          title: formData.title,
          region: formData.region,
          province: formData.province,
          address: formData.address,
          category: formData.category,
          priceRange: formData.priceRange || "",
          description: formData.description || "",
          openingHours: formData.openingHours || "",
          phoneNumber: formData.phoneNumber || "",
          website: formData.website || "",
          amenities: formData.amenities || [],
          subcategory: formData.subcategory || "",
        });
        return;
      }

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("region", formData.region);
      fd.append("province", formData.province);
      fd.append("address", formData.address);
      fd.append("category", formData.category);
      fd.append("priceRange", formData.priceRange || "");
      fd.append("description", formData.description || "");
      fd.append("openingHours", formData.openingHours || "");
      fd.append("phoneNumber", formData.phoneNumber || "");
      fd.append("website", formData.website || "");
      fd.append("amenities", JSON.stringify(formData.amenities || []));
      fd.append("subcategory", formData.subcategory || "");

      // attach images
      formData.images.forEach((file) => {
        fd.append("images", file);
      });

      // include author id from context (if available)
      if (user && user.id) {
        fd.append("authorId", user.id);
      }

      const res = await fetch("/api/post", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert("Đăng bài thất bại");
        return;
      }

      alert("Đăng bài thành công");
      // Chuyển về trang Điểm đến để thấy danh sách cập nhật
      window.location.href = "/destinations";
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi đăng bài");
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  if (isPreviewMode) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.previewHeader}>
          <h2>Xem trước bài đăng</h2>
          <button onClick={togglePreview} className={styles.editButton}>
            ← Quay lại chỉnh sửa
          </button>
        </div>

        <div className={styles.previewContent}>
          <div className={styles.previewImageGallery}>
            {imagesPreviews.map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index + 1}`} />
            ))}
          </div>

          <div className={styles.previewInfo}>
            <div className={styles.previewCategory}>
              {categories.find((c) => c.value === formData.category)?.icon}
              {categories.find((c) => c.value === formData.category)?.label}
              {formData.subcategory && (
                <div className={styles.previewSubcategory}>
                  —{" "}
                  {currentSubcategories.find(
                    (s) => s.value === formData.subcategory
                  )?.label || formData.subcategory}
                </div>
              )}
            </div>

            <h1>{formData.title}</h1>

            <div className={styles.previewDetails}>
              <p>
                <strong>🗺️ Khu vực:</strong>{" "}
                {regions.find((r) => r.value === formData.region)?.label}
              </p>
              <p>
                <strong>📌 Tỉnh/TP:</strong> {formData.province}
              </p>
              <p>
                <strong>📍 Địa chỉ:</strong> {formData.address},{" "}
                {formData.province}
              </p>
              <p>
                <strong>💰 Mức giá:</strong>{" "}
                {
                  priceRanges.find((p) => p.value === formData.priceRange)
                    ?.label
                }
              </p>
              {formData.phoneNumber && (
                <p>
                  <strong>📞 Điện thoại:</strong> {formData.phoneNumber}
                </p>
              )}
              {formData.openingHours && (
                <p>
                  <strong>🕐 Giờ mở cửa:</strong> {formData.openingHours}
                </p>
              )}
              {formData.website && (
                <p>
                  <strong>🌐 Website:</strong> {formData.website}
                </p>
              )}
            </div>

            <div className={styles.previewDescription}>
              <h3>Mô tả</h3>
              <p>{formData.description}</p>
            </div>

            {formData.amenities.length > 0 && (
              <div className={styles.previewAmenities}>
                <h3>Tiện ích</h3>
                <div className={styles.amenitiesTags}>
                  {formData.amenities.map((amenity, index) => (
                    <span key={index} className={styles.amenityTag}>
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.previewActions}>
          <button onClick={handleSubmit} className={styles.publishButton}>
            {onSubmitJson || onSubmitFormData ? "Cập nhật" : "Đăng bài"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{onSubmitJson || onSubmitFormData ? "Chỉnh sửa bài đăng" : "Đăng bài địa điểm du lịch"}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Image Upload Section */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>
            Hình ảnh <span className={styles.required}>*</span>
            <span className={styles.hint}>
              (Tối đa 10 ảnh, mỗi ảnh không quá 5MB)
            </span>
          </label>

          <div className={styles.imageUploadArea}>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />

            <div className={styles.imageGrid}>
              {imagesPreviews.map((preview, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles.removeImageBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {imagesPreviews.length < 10 && (
                <label htmlFor="imageUpload" className={styles.uploadButton}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span>Thêm ảnh</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className={styles.section}>
          <label className={styles.label}>
            Tên địa điểm <span className={styles.required}>*</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="VD: Khách sạn Mường Thanh, Quán phở Hòa..."
              className={styles.input}
              required
            />
          </label>

          <div className={styles.row}>
            {/* Region Selection */}
            <label className={styles.label}>
              Khu vực <span className={styles.required}>*</span>
              <select
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
                className={styles.select}
                required
              >
                <option value="">-- Chọn khu vực --</option>
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.icon} {region.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Province Selection */}
            <label className={styles.label}>
              Tỉnh/Thành phố <span className={styles.required}>*</span>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={styles.select}
                disabled={!formData.region}
                required
              >
                <option value="">
                  {formData.region
                    ? "-- Chọn tỉnh/thành phố --"
                    : "-- Chọn khu vực trước --"}
                </option>
                {formData.region &&
                  provinces[formData.region]?.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <label className={styles.label}>
            Địa chỉ chi tiết <span className={styles.required}>*</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="VD: 123 Nguyễn Văn Linh, Phường Tân Thuận Đông"
              className={styles.input}
              required
            />
          </label>
        </div>

        {/* Category Selection */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>
            Danh mục <span className={styles.required}>*</span>
          </label>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <div
                key={category.value}
                className={`${styles.categoryCard} ${
                  formData.category === category.value ? styles.selected : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, category: category.value }))
                }
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Subcategory Selection */}
        {formData.category && currentSubcategories.length > 0 && (
          <div className={styles.section}>
            <label className={styles.sectionTitle}>Danh mục con</label>

            <div className={styles.subcategoryGrid}>
              {currentSubcategories.map((sub) => (
                <div
                  key={sub.value}
                  className={`${styles.subcategoryCard} ${
                    formData.subcategory === sub.value ? styles.selected : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, subcategory: sub.value }))
                  }
                >
                  <span className={styles.subcategoryLabel}>{sub.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>
            Mức giá <span className={styles.required}>*</span>
          </label>
          <div className={styles.priceGrid}>
            {priceRanges.map((price) => (
              <div
                key={price.value}
                className={`${styles.priceCard} ${
                  formData.priceRange === price.value ? styles.selected : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, priceRange: price.value }))
                }
              >
                <div className={styles.priceLabel}>{price.label}</div>
                <div className={styles.priceDesc}>{price.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className={styles.section}>
          <div className={styles.row}>
            <label className={styles.label}>
              Số điện thoại
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="VD: 0901234567"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Giờ mở cửa
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleInputChange}
                placeholder="VD: 8:00 - 22:00"
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            Website
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="VD: https://example.com"
              className={styles.input}
            />
          </label>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <label className={styles.label}>
            Mô tả chi tiết
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết về địa điểm, đặc điểm nổi bật, trải nghiệm..."
              className={styles.textarea}
              rows={6}
            />
          </label>
        </div>

        {/* Amenities */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>Tiện ích</label>
          <div className={styles.amenitiesGrid}>
            {amenitiesList.map((amenity) => (
              <label key={amenity} className={styles.amenityCheckbox}>
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={togglePreview}
            className={styles.previewButton}
          >
            👁️ Xem trước
          </button>
          <button type="submit" className={styles.submitButton}>
            {onSubmitJson || onSubmitFormData ? "💾 Cập nhật" : "📤 Đăng bài"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
