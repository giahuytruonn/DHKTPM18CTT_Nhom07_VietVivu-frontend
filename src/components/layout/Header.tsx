import { Link } from "react-router-dom";
import { Globe, Menu, X, ChevronDown, User, Shield } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform duration-300">
              <Globe className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              VietVivu
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {["Trang chủ", "Tất cả tour", "Về chúng tôi", "Blog"].map((item, idx) => {
              const paths = ["/", "/tours", "/about", "/blog"];
              return (
                <Link
                  key={idx}
                  to={paths[idx]}
                  className="relative px-4 py-2 text-gray-700 font-medium transition-all duration-300 hover:text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Login Dropdown - ĐÃ SỬA HOÀN HẢO */}
            <div
              className="relative"
              onMouseEnter={() => setLoginDropdown(true)}
              onMouseLeave={() => setLoginDropdown(false)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 group">
                <span>Đăng nhập</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${loginDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown - Không còn khoảng trống, mượt 100% */}
              <div
                className={`
                  absolute right-0 top-full mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100
                  overflow-hidden z-50 transition-all duration-200 ease-out origin-top-right
                  ${loginDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
                style={{ pointerEvents: loginDropdown ? 'auto' : 'none' }}
              >
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">Người dùng</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 border-t border-gray-100"
                >
                  <Shield size={18} />
                  <span className="font-medium">Quản trị viên</span>
                </Link>
              </div>
            </div>

            {/* Đăng ký */}
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/tours"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
            >
              Tất cả tour
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
            >
              Về chúng tôi
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>

            <div className="pt-2 border-t border-gray-200 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-indigo-600 font-medium"
              >
                <User size={18} />
                Đăng nhập (Người dùng)
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-indigo-600 font-medium"
              >
                <Shield size={18} />
                Đăng nhập (Admin)
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}