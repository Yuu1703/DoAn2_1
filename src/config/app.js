/**
 * Cấu hình chung của ứng dụng
 */

export const appConfig = {
  name: 'DoAn2_3 App',
  version: '1.0.0',
  description: 'Ứng dụng web được xây dựng bằng Next.js',
  author: 'Your Name',
};

// Cấu hình API
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
};

// Cấu hình database (nếu cần)
export const dbConfig = {
  // Thêm cấu hình database tại đây
};
