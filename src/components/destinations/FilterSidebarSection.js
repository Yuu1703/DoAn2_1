import { useState, useEffect } from "react";
import { X, RotateCcw, Filter } from "lucide-react";
import styles from "@/styles/FilterSidebarSection.module.css";


export default function FilterSidebarSection() {
  const [filters, setFilters] = useState({
    rating: [],
    category: "all",
    subcategory: [],
    amenities: [], // ✅ THÊM amenities
  });


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Dispatch filter changes to ProductsDisplaySection
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    window.dispatchEvent(
      new CustomEvent("sidebarFiltersChange", {
        detail: newFilters,
      })
    );
  };


  const handleResetFilters = () => {
    const resetFilters = { 
      rating: [], 
      category: "all", 
      subcategory: [],
      amenities: [] // ✅ THÊM amenities
    };
    setFilters(resetFilters);
    window.dispatchEvent(
      new CustomEvent("sidebarFiltersChange", {
        detail: resetFilters,
      })
    );
    // Also reset search filters
    window.dispatchEvent(
      new CustomEvent("searchFiltersChange", {
        detail: { keyword: "", region: "all", location: "all" },
      })
    );
  };


  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "hotel", label: "Khách sạn" },
    { value: "resort", label: "Resort" },
    { value: "homestay", label: "Homestay" },
    { value: "restaurant", label: "Quán ăn" },
    { value: "cafe", label: "Quán nước & Cafe" },
    { value: "tourist-attraction", label: "Điểm tham quan" },
    { value: "entertainment", label: "Địa điểm giải trí" },
    { value: "shopping", label: "Mua sắm" },
    { value: "spa", label: "Spa & Làm đẹp" },
    { value: "nightlife", label: "Cuộc sống về đêm" },
    { value: "vehicle-rental", label: "Thuê xe" },
  ];


  // ✅ THÊM: Danh sách tiện ích
  const amenitiesList = [
    { value: "WiFi miễn phí", label: "WiFi miễn phí" },
    { value: "Bãi đỗ xe", label: "Bãi đỗ xe" },
    { value: "Điều hòa", label: "Điều hòa" },
    { value: "Thú cưng", label: "Thú cưng" },
    { value: "Thanh toán thẻ", label: "Thanh toán thẻ" },
    { value: "Giao hàng", label: "Giao hàng" },
    { value: "Phòng riêng", label: "Phòng riêng" },
    { value: "Khu vực ngoài trời", label: "Khu vực ngoài trời" },
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


  const currentSubcategories =
    filters.category !== "all"
      ? subcategoriesByCategory[filters.category] || []
      : [];


  const handleRatingChange = (rating) => {
    const newRatings = filters.rating.includes(rating)
      ? filters.rating.filter((r) => r !== rating)
      : [...filters.rating, rating];


    handleFilterChange({ ...filters, rating: newRatings });
  };


  const handleCategoryChange = (category) => {
    handleFilterChange({
      ...filters,
      category,
      subcategory: [], // Reset subcategory when category changes
      amenities: [], // ✅ Reset amenities when category changes
    });
  };


  const handleSubcategoryChange = (subcategory) => {
    const newSubcategories = filters.subcategory.includes(subcategory)
      ? filters.subcategory.filter((s) => s !== subcategory)
      : [...filters.subcategory, subcategory];


    handleFilterChange({ ...filters, subcategory: newSubcategories });
  };


  // ✅ THÊM: Handler cho amenities
  const handleAmenityChange = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange({ ...filters, amenities: newAmenities });
  };


  const sidebarClasses = `${styles.sidebar} ${
    isMobile ? (isFilterOpen ? styles.open : styles.closed) : ""
  }`;


  return (
    <>
      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className={styles.header}>
          <h3>Bộ lọc</h3>
          <div className={styles.headerActions}>
            <button onClick={handleResetFilters} className={styles.resetButton}>
              <RotateCcw size={16} />
              Đặt lại
            </button>
            {isMobile && (
              <button
                onClick={() => setIsFilterOpen(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>


        {/* Rating Filter */}
        <div className={styles.filterSection}>
          <h4>Số sao đánh giá</h4>
          <div className={styles.checkboxGroup}>
            {[
              { value: "5", label: "5 sao (4.5-5.0)" },
              { value: "4", label: "4 sao (4.0-4.4)" },
              { value: "3", label: "3 sao (3.0-3.9)" },
              { value: "2", label: "2 sao (2.0-2.9)" },
            ].map((rating) => (
              <label key={rating.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.rating.includes(rating.value)}
                  onChange={() => handleRatingChange(rating.value)}
                  className={styles.checkbox}
                />
                <span>{rating.label}</span>
              </label>
            ))}
          </div>
        </div>


        {/* Category Filter */}
        <div className={styles.filterSection}>
          <h4>Loại sản phẩm</h4>
          <div className={styles.radioGroup}>
            {categories.map((category) => (
              <label key={category.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={() => handleCategoryChange(category.value)}
                  className={styles.radio}
                />
                <span>{category.label}</span>
              </label>
            ))}
          </div>
        </div>


        {/* Subcategory Filter */}
        {currentSubcategories.length > 0 && (
          <div className={styles.filterSection}>
            <h4>Danh mục</h4>
            <div className={styles.checkboxGroup}>
              {currentSubcategories.map((subcategory) => (
                <label key={subcategory.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.subcategory.includes(subcategory.value)}
                    onChange={() => handleSubcategoryChange(subcategory.value)}
                    className={styles.checkbox}
                  />
                  <span>{subcategory.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}


        {/* ✅ THÊM: Amenities Filter - CHỈ HIỆN KHI ĐÃ CHỌN CATEGORY (KHÔNG PHẢI "TẤT CẢ") */}
        {filters.category !== "all" && (
          <div className={styles.filterSection}>
            <h4>Tiện ích</h4>
            <div className={styles.checkboxGroup}>
              {amenitiesList.map((amenity) => (
                <label key={amenity.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                    className={styles.checkbox}
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>


      {/* Mobile Filter Toggle */}
      {isMobile && (
        <>
          <button
            className={styles.filterToggle}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            Bộ lọc
          </button>


          {isFilterOpen && (
            <div
              className={styles.backdrop}
              onClick={() => setIsFilterOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
}
