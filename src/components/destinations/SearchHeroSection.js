import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import styles from '@/styles/SearchHeroSection.module.css';

const provinces = {
  "mien-bac": ["Hà Nội", "Quảng Ninh", "Lào Cai", "Ninh Bình", "Hải Phòng"],
  "mien-trung": ["Đà Nẵng", "Quảng Nam", "Thừa Thiên Huế", "Khánh Hòa", "Quảng Bình"], 
  "mien-nam": ["TP.HCM", "Kiên Giang", "Lâm Đồng", "Bà Rịa-Vũng Tàu", "Cần Thơ"]
};

export default function SearchHeroSection() {
  const [filters, setFilters] = useState({
    keyword: '',
    region: 'all',
    location: 'all'
  });

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    
    // Reset location when region changes
    if (field === 'region' && value !== filters.region) {
      newFilters.location = 'all';
    }
    
    setFilters(newFilters);
    
    // Dispatch event để sections khác nhận được
    window.dispatchEvent(new CustomEvent('searchFiltersChange', {
      detail: newFilters
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('searchFiltersChange', {
      detail: filters
    }));
  };

  const availableProvinces = filters.region === 'all' 
    ? Object.values(provinces).flat()
    : provinces[filters.region] || [];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Khám phá địa điểm tuyệt vời tại Việt Nam
          </h1>
          <p className={styles.subtitle}>
            Hơn 200+ địa điểm được review chân thực từ cộng đồng VietJourney
          </p>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchGroup}>
              <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Nhập tên địa điểm..."
                  value={filters.keyword}
                  onChange={(e) => handleInputChange('keyword', e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.selectWrapper}>
                <MapPin className={styles.selectIcon} size={18} />
                <select
                  value={filters.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={styles.select}
                >
                  <option value="all">Tất cả miền</option>
                  <option value="mien-bac">Miền Bắc</option>
                  <option value="mien-trung">Miền Trung</option>
                  <option value="mien-nam">Miền Nam</option>
                </select>
                <ChevronDown className={styles.chevronIcon} size={16} />
              </div>
              
              <div className={styles.selectWrapper}>
                <select
                  value={filters.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={styles.select}
                  disabled={filters.region === 'all'}
                >
                  <option value="all">Tất cả tỉnh/thành</option>
                  {availableProvinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                <ChevronDown className={styles.chevronIcon} size={16} />
              </div>
              
              <button type="submit" className={styles.searchButton}>
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
