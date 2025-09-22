/**
 * Các hàm tiện ích chung
 */

/**
 * Format định dạng số tiền
 * @param {number} amount - Số tiền
 * @param {string} currency - Đơn vị tiền tệ
 * @returns {string} Chuỗi đã format
 */
export const formatCurrency = (amount, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format định dạng ngày tháng
 * @param {Date} date - Ngày cần format
 * @param {string} locale - Locale
 * @returns {string} Chuỗi ngày đã format
 */
export const formatDate = (date, locale = 'vi-VN') => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

/**
 * Tạo slug từ string
 * @param {string} text - Text cần tạo slug
 * @returns {string} Slug
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/[^\w\s-]/g, '') // Bỏ ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/^-+|-+$/g, ''); // Bỏ dấu gạch ngang ở đầu và cuối
};
