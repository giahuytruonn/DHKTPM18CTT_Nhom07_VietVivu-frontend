import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    Trash2,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Heart,
    FileText,
    BarChart3,
    Globe,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUser } from "../../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutService } from "../../services/auth.service";
import toast from "react-hot-toast";

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
            title: "Thêm Tour",
            icon: PlusCircle,
            path: "/admin/tours/create",
        },
        {
            title: "Người dùng",
            icon: Users,
            path: "/admin/users",
        },
        {
            title: "Đánh giá",
            icon: Heart,
            path: "/admin/reviews",
        },
        {
            title: "Báo cáo",
            icon: BarChart3,
            path: "/admin/reports",
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
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-gradient-to-b from-indigo-900 to-purple-900 text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 lg:w-20"}
          overflow-hidden
        `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Globe className="text-white" size={24} />
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-xl">Admin Panel</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                                        ? "bg-white text-indigo-900 shadow-lg"
                                        : "hover:bg-white/10 text-white/80 hover:text-white"
                                    }
                `}
                            >
                                <Icon size={20} />
                                {sidebarOpen && (
                                    <span className="font-medium">{item.title}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all mb-2"
                    >
                        <Globe size={20} />
                        {sidebarOpen && <span className="font-medium">Về trang chủ</span>}
                    </Link>

                    <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all mb-2"
                    >
                        <Settings size={20} />
                        {sidebarOpen && <span className="font-medium">Cài đặt</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-white transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {menuItems.find(item => item.path === location.pathname)?.title || "Dashboard"}
                        </h1>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdown(!userDropdown)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${userDropdown ? "rotate-180" : ""}`}
                            />
                        </button>

                        {userDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user?.name || "Admin"}
                                    </p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
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
                        )}
                    </div>
                </header>

                {/* Page Content */}
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