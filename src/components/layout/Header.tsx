import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            VietVivu
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">
              Trang chủ
            </Link>
            <Link to="/tours" className="text-gray-700 hover:text-indigo-600 font-medium">
              Tất cả tour
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
              Về chúng tôi
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-indigo-600 font-medium">
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Đăng ký
            </Link>
          </div>


          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-gray-700">Trang chủ</Link>
            <Link to="/tours" className="block py-2 text-gray-700">Tất cả tour</Link>
            <Link to="/about" className="block py-2 text-gray-700">Về chúng tôi</Link>
            <Link to="/blog" className="block py-2 text-gray-700">Blog</Link>
            <Link to="/login" className="block py-2 text-indigo-600">Đăng nhập</Link>
            <Link to="/register" className="block py-2 text-indigo-600 font-medium">Đăng ký</Link>
          </div>
        </div>
      )}
    </header>
  );
}