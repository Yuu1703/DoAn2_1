/**
 * Footer Component - Phần footer của ứng dụng
 */

import { appConfig } from '@/config/app';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">{appConfig.name}</h3>
            <p className="text-gray-400 mb-4">
              {appConfig.description}
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 {appConfig.name}. Tất cả quyền được bảo lưu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@example.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Address: Việt Nam</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
