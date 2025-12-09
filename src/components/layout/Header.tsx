import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Heart, LogOut, Shield, TicketCheck, Key, Star } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUser } from "../../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutService } from "../../services/auth.service";
import toast from "react-hot-toast";
import logo from "../../assets/logo-vietvivu.png";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, authenticated, logout: authLogout } = useAuthStore();
  const { user, isLoading: userLoading } = useUser();

  // Kiểm tra role admin
  const isAdmin = token
    ? (() => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.scope?.includes("ROLE_ADMIN") || false;
        } catch {
          return false;
        }
      })()
    : false;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (token) {
        await logoutService(token);
      }
    },
    onSuccess: () => {
      authLogout();
      queryClient.clear();
      toast.success("Đăng xuất thành công!");
      navigate("/");
    },
    onError: () => {
      authLogout();
      queryClient.clear();
      navigate("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setUserDropdown(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="VietVivu logo"
              className="w-10 h-10 rounded-full object-cover mr-3 shadow-md group-hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              VietVivu
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/tours", label: "Tất cả tour" },
              { to: "/about", label: "Về chúng tôi" },
              { to: "/blog", label: "Blog" },
              { to: "/feed", label: "Khám phá" },
              { to: "/contact", label: "Liên hệ" },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="relative px-4 py-2 text-gray-700 font-medium transition-all duration-300 hover:text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}

            {/* Admin link - chỉ hiện khi là admin */}
            {authenticated && isAdmin && (
              <Link
                to="/admin/tours"
                className="flex items-center gap-2 px-4 py-2 text-purple-700 font-medium transition-all duration-300 hover:text-purple-900"
              >
                <Shield size={18} />
                Quản lý
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {authenticated && user ? (
              // User đã đăng nhập
              <div
                className="relative"
                onMouseEnter={() => setUserDropdown(true)}
                onMouseLeave={() => setUserDropdown(false)}
              >
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.username?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <span className="font-medium text-gray-700">
                    {user.name || user.username}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      userDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`
                    absolute right-0 top-full mt-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100
                    overflow-hidden z-50 transition-all duration-200 ease-out origin-top-right
                    ${
                      userDropdown
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }
                  `}
                >
                  {/* User info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <User size={18} />
                    <span className="font-medium">Thông tin cá nhân</span>
                  </Link>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <TicketCheck size={18} />
                    <span className="font-medium">Booking của tôi</span>
                  </Link>

                  <Link
                    to="/favorite-tours"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Heart size={18} />
                    <span className="font-medium">Tour yêu thích</span>
                  </Link>

                  <Link
                    to="/change-password"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Key size={18} />
                    <span className="font-medium">Đổi mật khẩu</span>
                  </Link>
                    
                  <Link
                    
                    to="/review"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Star size={18} />
                    <span className="font-medium">Đánh giá của tôi</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              // Chưa đăng nhập
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Đăng ký
                </Link>
              </>
            )}
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

            {authenticated && isAdmin && (
              <Link
                to="/admin/tours"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-purple-700 font-medium hover:text-purple-900 transition-colors"
              >
                <Shield size={18} />
                Quản lý
              </Link>
            )}

            <div className="pt-2 border-t border-gray-200 space-y-2">
              {authenticated && user ? (
                <>
                  <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <User size={18} />
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <TicketCheck size={18} />
                    Booking của tôi
                  </Link>
                  <Link
                    to="/favorite-tours"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <Heart size={18} />
                    Tour yêu thích
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-2 text-red-600 font-medium"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-2 text-indigo-600 font-medium"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
