import { useState, useEffect, useMemo } from 'react';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/ProductsDisplaySection.module.css';

// HARDCODED DATA
const destinations = [
  {
    id: 1,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-bac",
    location: "Quảng Ninh", 
    name: "Sunset Café Hạ Long",
    category: "quan-nuoc",
    subcategory: ["cafe", "view-dep", "lang-man"],
    description: "Quán café view vịnh đẹp nhất Hạ Long, lý tưởng cho cặp đôi",
    reviews: 245,
    rating: 4.7
  },
  {
    id: 2,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-bac", 
    location: "Lào Cai",
    name: "Valley View Homestay Sapa",
    category: "homestay",
    subcategory: ["view-nui", "van-hoa-dan-toc", "trai-nghiem-thuc-te"],
    description: "Homestay giữa ruộng bậc thang với trải nghiệm văn hóa H'mông",
    reviews: 189,
    rating: 4.9
  },
  {
    id: 3,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-trung",
    location: "Quảng Nam",
    name: "Nhà Cổ Hội An Restaurant",
    category: "quan-an",
    subcategory: ["mon-viet", "lich-su", "cao-cap"],
    description: "Nhà hàng trong ngôi nhà cổ 200 năm tuổi, món ăn truyền thống",
    reviews: 312,
    rating: 4.6
  },
  {
    id: 4,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-trung",
    location: "Đà Nẵng", 
    name: "Cầu Rồng Đà Nẵng",
    category: "dia-diem",
    subcategory: ["thien-nhien", "van-hoa", "check-in"],
    description: "Cây cầu biểu tượng của Đà Nẵng, đặc biệt đẹp về đêm",
    reviews: 567,
    rating: 4.8
  },
  {
    id: 5,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-nam",
    location: "TP.HCM",
    name: "Saigon Sky Coffee",
    category: "quan-nuoc", 
    subcategory: ["cafe", "rooftop", "view-thanh-pho"],
    description: "Quán café rooftop view toàn cảnh Sài Gòn từ tầng 40",
    reviews: 423,
    rating: 4.5
  },
  {
    id: 6,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-nam",
    location: "Kiên Giang",
    name: "Sunset Beach Resort Phú Quốc", 
    category: "resort",
    subcategory: ["gan-bien", "luxury", "honeymoon"],
    description: "Resort 5 sao với bãi biển riêng và dịch vụ cao cấp",
    reviews: 198,
    rating: 4.9
  },
  {
    id: 7,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-trung",
    location: "Thừa Thiên Huế",
    name: "Đại Nội Huế",
    category: "dia-diem",
    subcategory: ["lich-su", "van-hoa", "di-san"],
    description: "Quần thể cung đình nhà Nguyễn - Di sản văn hóa thế giới",
    reviews: 678,
    rating: 4.7
  },
  {
    id: 8,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-bac",
    location: "Hà Nội",
    name: "Phố Phở Hàng Bông",
    category: "quan-an",
    subcategory: ["mon-viet", "street-food", "gia-re"],
    description: "Quán phở nổi tiếng 50 năm tuổi giữa lòng phố cổ Hà Nội",
    reviews: 834,
    rating: 4.6
  },
  {
    id: 9,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-nam", 
    location: "Lâm Đồng",
    name: "Vườn Hoa Đà Lạt",
    category: "dia-diem",
    subcategory: ["thien-nhien", "check-in", "gia-dinh"],
    description: "Vườn hoa rộng 7000m² với hàng trăm loài hoa quanh năm",
    reviews: 445,
    rating: 4.4
  },
  {
    id: 10,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-bac",
    location: "Ninh Bình", 
    name: "Tràng An - Tam Cốc",
    category: "dia-diem",
    subcategory: ["thien-nhien", "di-san", "thuyen-kayak"],
    description: "Quần thể danh thắng Tràng An - Di sản văn hóa và thiên nhiên",
    reviews: 723,
    rating: 4.8
  },
  {
    id: 11,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-trung",
    location: "Khánh Hòa",
    name: "Vinpearl Nha Trang",
    category: "resort",
    subcategory: ["gan-bien", "gia-dinh", "vui-choi"],
    description: "Khu nghỉ dưỡng giải trí trên đảo Hòn Tre",
    reviews: 356,
    rating: 4.5
  },
  {
    id: 12,
    image: "/destinations/halong-sunset-cafe.jpg",
    region: "mien-nam",
    location: "Bà Rịa-Vũng Tàu",
    name: "Ocean View Hotel Vũng Tàu",
    category: "khach-san", 
    subcategory: ["gan-bien", "mid-range", "gia-dinh"],
    description: "Khách sạn 4 sao view biển, gần bãi tắm Sau",
    reviews: 267,
    rating: 4.3
  }
];

const ITEMS_PER_PAGE = 8;

export default function ProductsDisplaySection() {
  // State
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    region: 'all',
    location: 'all'
  });
  
  const [sidebarFilters, setSidebarFilters] = useState({
    rating: [],
    category: 'all',
    subcategory: []
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

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

    window.addEventListener('searchFiltersChange', handleSearchFiltersChange);
    window.addEventListener('sidebarFiltersChange', handleSidebarFiltersChange);
    
    return () => {
      window.removeEventListener('searchFiltersChange', handleSearchFiltersChange);
      window.removeEventListener('sidebarFiltersChange', handleSidebarFiltersChange);
    };
  }, []);

  // Filter and sort logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = destinations.filter(dest => {
      // Search filters
      if (searchFilters.keyword && !dest.name.toLowerCase().includes(searchFilters.keyword.toLowerCase())) {
        return false;
      }
      if (searchFilters.region !== 'all' && dest.region !== searchFilters.region) {
        return false;
      }
      if (searchFilters.location !== 'all' && dest.location !== searchFilters.location) {
        return false;
      }
      
      // Sidebar filters
      if (sidebarFilters.rating.length > 0) {
        const matchesRating = sidebarFilters.rating.some(rating => {
          if (rating === '5') return dest.rating >= 4.5;
          if (rating === '4') return dest.rating >= 4.0 && dest.rating < 4.5;
          if (rating === '3') return dest.rating >= 3.0 && dest.rating < 4.0;
          if (rating === '2') return dest.rating >= 2.0 && dest.rating < 3.0;
          return false;
        });
        if (!matchesRating) return false;
      }
      
      if (sidebarFilters.category !== 'all' && dest.category !== sidebarFilters.category) {
        return false;
      }
      
      if (sidebarFilters.subcategory.length > 0) {
        const hasMatchingSubcategory = sidebarFilters.subcategory.some(sub => 
          dest.subcategory.includes(sub)
        );
        if (!hasMatchingSubcategory) return false;
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'reviews-most':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        filtered.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }
    
    return filtered;
  }, [searchFilters, sidebarFilters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const currentItems = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change với scroll
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll lên đầu trang smooth
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Destination Card Component
  const DestinationCard = ({ data }) => {
    const { image, location, name, category, subcategory, description, rating, reviews } = data;

    const categoryNames = {
      'dia-diem': 'Điểm tham quan',
      'quan-an': 'Quán ăn', 
      'quan-nuoc': 'Quán nước',
      'resort': 'Resort',
      'homestay': 'Homestay',
      'khach-san': 'Khách sạn',
      'thue-xe': 'Thuê xe'
    };

    // Fallback image nếu không load được
    const handleImageError = (e) => {
      e.target.src = "https://via.placeholder.com/400x300?text=VietJourney";
    };

    return (
      <div className={styles.card}>
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
              <span>{rating} ({reviews} đánh giá)</span>
            </div>
            
            <button className={styles.detailButton}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.section}>
      {/* Result Header */}
      <div className={styles.resultHeader}>
        <span className={styles.resultCount}>
          Tìm thấy {filteredAndSortedData.length} kết quả
        </span>
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
      </div>
      
      {/* Products Grid */}
      <div className={styles.grid}>
        {currentItems.map(destination => (
          <DestinationCard key={destination.id} data={destination} />
        ))}
      </div>
      
      {/* No Results */}
      {filteredAndSortedData.length === 0 && (
        <div className={styles.noResults}>
          <p>Không tìm thấy kết quả phù hợp. Vui lòng thử lại với bộ lọc khác.</p>
        </div>
      )}
      
      {/* Pagination với scroll */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Đang xem: {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} của {filteredAndSortedData.length}
          </div>
          
          <div className={styles.paginationControls}>
            {/* Nút Trước */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            
            {/* Số trang */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              >
                {i + 1}
              </button>
            ))}
            
            {/* Nút Tiếp */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Tiếp
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
