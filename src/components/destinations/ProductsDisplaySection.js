import { useState, useEffect, useMemo } from "react";
import { MapPin, Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import styles from "@/styles/ProductsDisplaySection.module.css";
import PostForm from "@/components/post/Postform";
import LoginNotification from "@/components/common/LoginNotification"; // ✅ THÊM IMPORT

const ITEMS_PER_PAGE = 8;

export default function ProductsDisplaySection() {
  const { user } = useUser();
  const router = useRouter();

  // State
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    region: "all",
    location: "all",
  });

  const [sidebarFilters, setSidebarFilters] = useState({
    rating: [],
    category: "all",
    subcategory: [],
    amenities: [],
  });

  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false); // ✅ THÊM STATE

  // Fetch destinations from API on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/posts/get-all");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const json = await res.json();
        const posts = json?.data || [];

        const transformed = posts.map((p) => {
          // Parse amenities safely
          let amenities = [];
          try {
            if (p.amenities) {
              amenities =
                typeof p.amenities === "string"
                  ? JSON.parse(p.amenities)
                  : Array.isArray(p.amenities)
                  ? p.amenities
                  : [];
            }
          } catch (err) {
            console.error("Failed to parse amenities:", err);
            amenities = [];
          }

          // Parse subcategory
          let subcategory = [];
          if (p.subcategory) {
            subcategory = Array.isArray(p.subcategory)
              ? p.subcategory
              : [p.subcategory];
          }

          return {
            id: String(p._id || p.id),
            image:
              (p.images && p.images[0]) ||
              "/destinations/halong-sunset-cafe.jpg",
            region: p.region || "",
            location: p.province || "",
            name: p.title || "",
            category: p.category || "",
            subcategory: subcategory,
            amenities: amenities,
            description: p.description || "",
            reviews: p.reviews || 0,
            rating: p.rating || 0,
          };
        });

        if (mounted) {
          setDestinations(transformed);
        }
      } catch (err) {
        console.error("Failed to load destinations:", err);
        if (mounted) setDestinations([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Load favorites from database when user logs in
  useEffect(() => {
    if (user && user.id) {
      loadFavoritesFromDB();
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Load favorites from database
  const loadFavoritesFromDB = async () => {
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    }
  };

  // Check if favorited
  const isFavorite = (id) => favorites.includes(id);

  // ✅ TOGGLE FAVORITE - HIỂN THỊ NOTIFICATION NẾU CHƯA ĐĂNG NHẬP
  const handleToggleFavorite = async (e, destinationId) => {
    e.preventDefault();
    e.stopPropagation();

    // ✅ KIỂM TRA ĐĂNG NHẬP - HIỂN THỊ NOTIFICATION
    if (!user || !user.id) {
      setShowLoginNotification(true); // ✅ HIỂN THỊ NOTIFICATION
      return;
    }

    // Animation
    const button = e.currentTarget;
    button.classList.add(styles.heartBounce);
    setTimeout(() => button.classList.remove(styles.heartBounce), 600);

    // Update local state (Optimistic Update)
    const isCurrentlyFavorite = favorites.includes(destinationId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== destinationId)
      : [...favorites, destinationId];

    setFavorites(newFavorites);

    // Save to database
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          destinationId: destinationId,
          action: isCurrentlyFavorite ? "remove" : "add",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update favorites");
      }

      const data = await res.json();
      setFavorites(data.favorites || newFavorites);

      if (isCurrentlyFavorite) {
        console.log("Đã xóa khỏi yêu thích");
      } else {
        console.log("Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      setFavorites(favorites);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // Listen to filters from other sections
  useEffect(() => {
    const handleSearchFiltersChange = (e) => {
      setSearchFilters(e.detail);
      setCurrentPage(1);
    };

    const handleSidebarFiltersChange = (e) => {
      setSidebarFilters(e.detail);
      setCurrentPage(1);
    };

    window.addEventListener("searchFiltersChange", handleSearchFiltersChange);
    window.addEventListener("sidebarFiltersChange", handleSidebarFiltersChange);

    return () => {
      window.removeEventListener(
        "searchFiltersChange",
        handleSearchFiltersChange
      );
      window.removeEventListener(
        "sidebarFiltersChange",
        handleSidebarFiltersChange
      );
    };
  }, []);

  // Filter and sort logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = destinations.filter((dest) => {
      // Search filters
      if (
        searchFilters.keyword &&
        !dest.name.toLowerCase().includes(searchFilters.keyword.toLowerCase())
      ) {
        return false;
      }
      if (
        searchFilters.region !== "all" &&
        dest.region !== searchFilters.region
      ) {
        return false;
      }
      if (
        searchFilters.location !== "all" &&
        dest.location !== searchFilters.location
      ) {
        return false;
      }

      // Sidebar filters - Rating
      if (sidebarFilters.rating.length > 0) {
        const matchesRating = sidebarFilters.rating.some((rating) => {
          if (rating === "5") return dest.rating >= 4.5;
          if (rating === "4") return dest.rating >= 4.0 && dest.rating < 4.5;
          if (rating === "3") return dest.rating >= 3.0 && dest.rating < 4.0;
          if (rating === "2") return dest.rating >= 2.0 && dest.rating < 3.0;
          return false;
        });
        if (!matchesRating) return false;
      }

      // Sidebar filters - Category
      if (
        sidebarFilters.category !== "all" &&
        dest.category !== sidebarFilters.category
      ) {
        return false;
      }

      // Sidebar filters - Subcategory
      if (sidebarFilters.subcategory.length > 0) {
        const hasMatchingSubcategory = sidebarFilters.subcategory.some((sub) =>
          dest.subcategory.includes(sub)
        );
        if (!hasMatchingSubcategory) return false;
      }

      // Sidebar filters - Amenities
      if (sidebarFilters.amenities && sidebarFilters.amenities.length > 0) {
        const destAmenities = dest.amenities || [];
        const hasMatchingAmenity = sidebarFilters.amenities.some((amenity) =>
          destAmenities.includes(amenity)
        );
        if (!hasMatchingAmenity) return false;
      }

      return true;
    });

    // Smart sort
    const hasAmenitiesFilter =
      sidebarFilters.amenities && sidebarFilters.amenities.length > 0;

    if (hasAmenitiesFilter && sortBy === "featured") {
      filtered.sort((a, b) => {
        const aAmenities = a.amenities || [];
        const bAmenities = b.amenities || [];

        const aMatchCount = sidebarFilters.amenities.filter((amenity) =>
          aAmenities.includes(amenity)
        ).length;

        const bMatchCount = sidebarFilters.amenities.filter((amenity) =>
          bAmenities.includes(amenity)
        ).length;

        if (aMatchCount !== bMatchCount) {
          return bMatchCount - aMatchCount;
        }

        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }

        return b.reviews - a.reviews;
      });
    } else {
      switch (sortBy) {
        case "rating-high":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "rating-low":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "reviews-most":
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        default:
          filtered.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
      }
    }

    return filtered;
  }, [destinations, searchFilters, sidebarFilters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const currentItems = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Destination Card Component
  const DestinationCard = ({ data }) => {
    const { image, location, name, category, description, rating, reviews } =
      data;

    const categoryNames = {
      hotel: "Khách sạn",
      resort: "Resort",
      homestay: "Homestay",
      restaurant: "Quán ăn",
      cafe: "Quán nước & Cafe",
      "tourist-attraction": "Điểm tham quan",
      entertainment: "Giải trí",
      shopping: "Mua sắm",
      spa: "Spa & Làm đẹp",
      nightlife: "Cuộc sống về đêm",
      "vehicle-rental": "Thuê xe",
    };

    const handleImageError = (e) => {
      e.target.src = "https://via.placeholder.com/400x300?text=VietJourney";
    };

    const handleOpenDetail = () => {
      router.push({ pathname: "/DeitalPost", query: { id: data.id } });
    };

    return (
      <div
        className={styles.card}
        onClick={handleOpenDetail}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.imageWrapper}>
          <img
            src={image}
            alt={name}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
          <div className={styles.rating}>
            <Star className={styles.starIcon} size={14} />
            <span>{rating}</span>
          </div>

          <button
            className={`${styles.favoriteButton} ${
              isFavorite(data.id) ? styles.favoriteActive : ""
            }`}
            onClick={(e) => handleToggleFavorite(e, data.id)}
            title={isFavorite(data.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              size={20}
              fill={isFavorite(data.id) ? "#dc2626" : "none"}
              stroke={isFavorite(data.id) ? "#dc2626" : "#ffffff"}
              strokeWidth={2}
            />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.location}>
            <MapPin size={14} />
            <span>{location}</span>
          </div>

          <h3 className={styles.name}>{name}</h3>
          <div className={styles.category}>
            <span className={styles.categoryTag}>
              {categoryNames[category] || category}
            </span>
          </div>

          <p className={styles.description}>{description}</p>

          <div className={styles.footer}>
            <div className={styles.reviews}>
              <Star className={styles.reviewStar} size={12} />
              <span>
                {rating} ({reviews} đánh giá)
              </span>
            </div>

            <button
              className={styles.detailButton}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetail();
              }}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.section}>
      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && destinations.length === 0 && (
        <div className={styles.error}>
          <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && destinations.length > 0 && (
        <>
          {/* Result Header */}
          <div className={styles.resultHeader}>
            <span className={styles.resultCount}>
              Tìm thấy {filteredAndSortedData.length} kết quả
            </span>
            <div className={styles.actions}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Nổi bật</option>
                <option value="rating-high">Đánh giá cao nhất</option>
                <option value="rating-low">Đánh giá thấp nhất</option>
                <option value="reviews-most">Nhiều đánh giá nhất</option>
              </select>
              <button
                type="button"
                className={styles.postButton}
                onClick={() => setIsPostOpen(true)}
              >
                Đăng bài
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.grid}>
            {currentItems.map((destination) => (
              <DestinationCard key={destination.id} data={destination} />
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedData.length === 0 && (
            <div className={styles.noResults}>
              <p>
                Không tìm thấy kết quả phù hợp. Vui lòng thử lại với bộ lọc
                khác.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Đang xem: {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredAndSortedData.length
                )}{" "}
                của {filteredAndSortedData.length}
              </div>

              <div className={styles.paginationControls}>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                >
                  <ChevronLeft size={16} />
                  Trước
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`${styles.pageButton} ${
                      currentPage === i + 1 ? styles.active : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
                >
                  Tiếp
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Modal Đăng bài */}
          {isPostOpen && (
            <div
              className={styles.modalOverlay}
              onClick={() => setIsPostOpen(false)}
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h3>Đăng bài địa điểm</h3>
                  <button
                    className={styles.modalClose}
                    onClick={() => setIsPostOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <PostForm />
                </div>
              </div>
            </div>
          )}

          {/* ✅ LOGIN NOTIFICATION - THÊM Ở CUỐI */}
          {showLoginNotification && (
            <LoginNotification 
              onClose={() => setShowLoginNotification(false)} 
            />
          )}
        </>
      )}
    </section>
  );
}
