import { useState, useEffect } from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';
import styles from '@/styles/FilterSidebarSection.module.css';

export default function FilterSidebarSection() {
  const [filters, setFilters] = useState({
    rating: [],
    category: 'all',
    subcategory: []
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dispatch filter changes to ProductsDisplaySection
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    window.dispatchEvent(new CustomEvent('sidebarFiltersChange', {
      detail: newFilters
    }));
  };

  const handleResetFilters = () => {
    const resetFilters = { rating: [], category: 'all', subcategory: [] };
    setFilters(resetFilters);
    window.dispatchEvent(new CustomEvent('sidebarFiltersChange', {
      detail: resetFilters
    }));
    // Also reset search filters
    window.dispatchEvent(new CustomEvent('searchFiltersChange', {
      detail: { keyword: '', region: 'all', location: 'all' }
    }));
  };

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'dia-diem', label: 'Điểm tham quan' },
    { value: 'quan-an', label: 'Quán ăn' },
    { value: 'quan-nuoc', label: 'Quán nước' }, 
    { value: 'resort', label: 'Resort' },
    { value: 'homestay', label: 'Homestay' },
    { value: 'khach-san', label: 'Khách sạn' },
    { value: 'thue-xe', label: 'Thuê xe' }
  ];

  const subcategoriesByCategory = {
    'dia-diem': [
      { value: 'thien-nhien', label: 'Thiên nhiên' },
      { value: 'lich-su', label: 'Lịch sử' },
      { value: 'van-hoa', label: 'Văn hóa' },
      { value: 'check-in', label: 'Check-in' }
    ],
    'quan-an': [
      { value: 'mon-viet', label: 'Món Việt' },
      { value: 'street-food', label: 'Street Food' },
      { value: 'cao-cap', label: 'Cao cấp' },
      { value: 'gia-re', label: 'Giá rẻ' }
    ],
    'quan-nuoc': [
      { value: 'cafe', label: 'Café' },
      { value: 'rooftop', label: 'Rooftop' },
      { value: 'view-dep', label: 'View đẹp' },
      { value: 'bar', label: 'Bar' }
    ],
    'resort': [
      { value: 'gan-bien', label: 'Gần biển' },
      { value: 'luxury', label: 'Luxury' },
      { value: 'gia-dinh', label: 'Gia đình' },
      { value: 'honeymoon', label: 'Honeymoon' }
    ],
    'homestay': [
      { value: 'view-nui', label: 'View núi' },
      { value: 'van-hoa-dan-toc', label: 'Văn hóa dân tộc' },
      { value: 'trai-nghiem-thuc-te', label: 'Trải nghiệm thực tế' }
    ],
    'khach-san': [
      { value: 'budget', label: 'Budget' },
      { value: 'mid-range', label: 'Mid-range' },
      { value: 'luxury', label: 'Luxury' },
      { value: 'gan-bien', label: 'Gần biển' }
    ]
  };

  const currentSubcategories = filters.category !== 'all' 
    ? subcategoriesByCategory[filters.category] || []
    : [];

  const handleRatingChange = (rating) => {
    const newRatings = filters.rating.includes(rating)
      ? filters.rating.filter(r => r !== rating)
      : [...filters.rating, rating];
    
    handleFilterChange({ ...filters, rating: newRatings });
  };

  const handleCategoryChange = (category) => {
    handleFilterChange({ 
      ...filters, 
      category,
      subcategory: [] // Reset subcategory when category changes
    });
  };

  const handleSubcategoryChange = (subcategory) => {
    const newSubcategories = filters.subcategory.includes(subcategory)
      ? filters.subcategory.filter(s => s !== subcategory)
      : [...filters.subcategory, subcategory];
    
    handleFilterChange({ ...filters, subcategory: newSubcategories });
  };

  const sidebarClasses = `${styles.sidebar} ${
    isMobile ? (isFilterOpen ? styles.open : styles.closed) : ''
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
              <button onClick={() => setIsFilterOpen(false)} className={styles.closeButton}>
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
              { value: '5', label: '5 sao (4.5-5.0)' },
              { value: '4', label: '4 sao (4.0-4.4)' },
              { value: '3', label: '3 sao (3.0-3.9)' },
              { value: '2', label: '2 sao (2.0-2.9)' }
            ].map(rating => (
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
            {categories.map(category => (
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
              {currentSubcategories.map(subcategory => (
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
