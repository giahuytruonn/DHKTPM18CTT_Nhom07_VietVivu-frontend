import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllToursAdmin } from "../services/tour.service";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  Eye,
  Heart,
  Star,
  ArrowUp,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAllToursAdmin,
    staleTime: 1000 * 60 * 5,
  });

  // Calculate statistics
  const stats = {
    totalTours: tours.length,
    openTours: tours.filter(t => t.tourStatus === "OPEN_BOOKING").length,
    inProgressTours: tours.filter(t => t.tourStatus === "IN_PROGRESS").length,
    completedTours: tours.filter(t => t.tourStatus === "COMPLETED").length,
    totalBookings: tours.reduce((sum, t) => sum + (t.totalBookings || 0), 0),
    totalFavorites: tours.reduce((sum, t) => sum + (t.favoriteCount || 0), 0),
    totalRevenue: tours.reduce((sum, t) => sum + (t.totalBookings || 0) * t.priceAdult, 0),
  };

  const statCards = [
    {
      title: "Tổng Tours",
      value: stats.totalTours,
      change: "+12%",
      isIncrease: true,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Đang Mở Booking",
      value: stats.openTours,
      change: "+5%",
      isIncrease: true,
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Tổng Đặt Tour",
      value: stats.totalBookings,
      change: "+23%",
      isIncrease: true,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Doanh Thu (ước tính)",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+18%",
      isIncrease: true,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const recentTours = tours
    .sort((a, b) => {
      const dateA = new Date(a.startDate || 0);
      const dateB = new Date(b.startDate || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const popularTours = tours
    .sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h1>
        <p className="text-indigo-100 text-sm md:text-base">
          Đây là tổng quan về hệ thống tour du lịch của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm text-green-600">
                  <ArrowUp size={16} />
                  <span className="font-semibold">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Tour Status Distribution */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Phân Bố Trạng Thái Tour</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-700">Đang mở booking</span>
                <span className="text-xs md:text-sm font-semibold text-green-600">{stats.openTours}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.openTours / stats.totalTours) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-700">Đang thực hiện</span>
                <span className="text-xs md:text-sm font-semibold text-blue-600">{stats.inProgressTours}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.inProgressTours / stats.totalTours) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-700">Đã hoàn thành</span>
                <span className="text-xs md:text-sm font-semibold text-gray-600">{stats.completedTours}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.completedTours / stats.totalTours) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Thống Kê Nhanh</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="text-blue-600" size={20} />
                </div>
                <span className="font-medium text-gray-700 text-sm md:text-base">Lượt xem</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-blue-600">
                {(stats.totalBookings * 12).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="text-pink-600" size={20} />
                </div>
                <span className="font-medium text-gray-700 text-sm md:text-base">Yêu thích</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-pink-600">{stats.totalFavorites}</span>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="text-yellow-600" size={20} />
                </div>
                <span className="font-medium text-gray-700 text-sm md:text-base">Đánh giá TB</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-yellow-600">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Popular Tours */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Tour Phổ Biến</h2>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
          <div className="space-y-3">
            {popularTours.map((tour, index) => (
              <div
                key={tour.tourId}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm md:text-base">{tour.title}</p>
                  <p className="text-xs md:text-sm text-gray-500">{tour.destination}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-indigo-600 text-sm md:text-base">{tour.totalBookings}</p>
                  <p className="text-xs text-gray-500">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tours */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Tour Mới Nhất</h2>
            <Calendar className="text-blue-500" size={24} />
          </div>
          <div className="space-y-3">
            {recentTours.map((tour) => (
              <div
                key={tour.tourId}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`
                  flex-shrink-0 px-2 md:px-3 py-1 rounded-full text-xs font-semibold
                  ${tour.tourStatus === 'OPEN_BOOKING' ? 'bg-green-100 text-green-700' : 
                    tour.tourStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'}
                `}>
                  {tour.tourStatus === 'OPEN_BOOKING' ? 'Mở' : 
                   tour.tourStatus === 'IN_PROGRESS' ? 'Đang chạy' : 'Hoàn thành'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm md:text-base">{tour.title}</p>
                  <p className="text-xs md:text-sm text-gray-500">{tour.destination}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs md:text-sm font-semibold text-gray-900">
                    {tour.priceAdult.toLocaleString()}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
