/**
 * Header Component - Thanh header của ứng dụng
 */

import Link from 'next/link';
import { appConfig } from '@/config/app';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-gray-900 text-xl">
                {appConfig.name}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Trang chủ
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Giới thiệu
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Liên hệ
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
