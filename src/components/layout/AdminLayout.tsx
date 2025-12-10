import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  TicketCheck,
  Gift,
  DollarSign,
  FileText,
  LucideVideo,
  Contact,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUser } from "../../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutService } from "../../services/auth.service";
import toast from "react-hot-toast";
import logo from "../../assets/logo-vietvivu.png";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token, logout: authLogout } = useAuthStore();
  const { user } = useUser();

  const menuItems = [
    {
      title: "Tổng quan",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Quản lý Tour",
      icon: Package,
      path: "/admin/tours",
    },
    {
      title: "Quản lý Khuyến mãi",
      icon: Gift,
      path: "/admin/promotions",
    },
    {
      title: "Thêm Tour",
      icon: PlusCircle,
      path: "/admin/tours/create",
    },
    {
      title: "Quản lý Contact",
      icon: Contact,
      path: "/admin/contacts",
    },
    {
      title: "Người dùng",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Xử lý Booking",
      icon: TicketCheck,
      path: "/admin/bookings-request",
    },
    {
      title: "Quản lý Video", // Mục mới
      icon: LucideVideo, // Dùng icon Video
      path: "/admin/videos",
    },
  ];

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
  };
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-gradient-to-b from-indigo-900 to-purple-900 text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 lg:w-20"}
          overflow-hidden flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src={logo}
              alt="VietVivu logo"
              className="w-10 h-10 rounded-lg object-cover shadow-md"
            />
            {sidebarOpen && (
              <span className="font-bold text-xl whitespace-nowrap">
                Admin Panel
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Render các item mặc định */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
          flex items-center gap-3 px-4 py-3 rounded-lg
          transition-all duration-200 whitespace-nowrap
          ${
            isActive
              ? "bg-white text-indigo-900 shadow-lg"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }
        `}
                title={!sidebarOpen ? item.title : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}

          {/* --- BÁO CÁO (Dropdown) --- */}
          <button
            onClick={() => setReportOpen(!reportOpen)}
            className={`
      flex items-center justify-between w-full px-4 py-3 rounded-lg
      transition-all duration-200 
      ${
        location.pathname.includes("/admin/reports")
          ? "bg-white text-indigo-900 shadow-lg"
          : "hover:bg-white/10 text-white/80 hover:text-white"
      }
    `}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={20} />
              {sidebarOpen && <span className="font-medium">Báo cáo</span>}
            </div>

            {sidebarOpen && (
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  reportOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* --- Dropdown con --- */}
          {reportOpen && sidebarOpen && (
            <div className="ml-10 mt-1 space-y-2">
              <Link
                to="/admin/reports/revenue"
                className={`block px-3 py-2 rounded-lg text-sm
          ${
            location.pathname === "/admin/reports/revenue"
              ? "bg-white text-indigo-900 shadow-md"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }
        `}
              >
                <DollarSign size={16} className="inline-block mr-2" />
                Báo cáo doanh thu
              </Link>

              <Link
                to="/admin/reports/others"
                className={`block px-3 py-2 rounded-lg text-sm
          ${
            location.pathname === "/admin/reports/others"
              ? "bg-white text-indigo-900 shadow-md"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }
        `}
              >
                <FileText size={16} className="inline-block mr-2" />
                Báo cáo khác
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom Actions - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap"
            title={!sidebarOpen ? "Về trang chủ" : undefined}
          >
            <img
              src={logo}
              alt="VietVivu logo"
              className="w-8 h-8 rounded-md object-cover flex-shrink-0"
            />
            {sidebarOpen && <span className="font-medium">Về trang chủ</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-white transition-all whitespace-nowrap"
            title={!sidebarOpen ? "Đăng xuất" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          {/* Page Title / Breadcrumb (optional) */}
          <div className="flex-1 lg:block hidden">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find((item) => item.path === location.pathname)
                ?.title || "Admin Panel"}
            </h1>
          </div>

          {/* User Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform flex-shrink-0 ${
                  userDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {userDropdown && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdown(false)}
                />

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Users size={16} />
                    <span className="text-sm">Thông tin cá nhân</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
