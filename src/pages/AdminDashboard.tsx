import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllToursAdmin } from "../services/tour.service";
import {
  getTotalRevenue,
  getMonthlyRevenue,
} from "../services/statistical.service";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  Heart,
  Star,
  ArrowUp,
  MapPin,
  Clock,
  Activity,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminDashboard: React.FC = () => {
  const { data: toursResponse, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => getAllToursAdmin(0, 1000),
    staleTime: 1000 * 60 * 5,
  });

  const { data: totalRevenue } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: getTotalRevenue,
    staleTime: 1000 * 60 * 5,
  });

  const { data: monthlyRevenue } = useQuery({
    queryKey: ["monthlyRevenue", new Date().getFullYear()],
    queryFn: () => getMonthlyRevenue(new Date().getFullYear()),
  });

  const tours = toursResponse?.items || [];

  // Calculate statistics
  const stats = {
    totalTours: tours.length,
    openTours: tours.filter((t) => t.tourStatus === "OPEN_BOOKING").length,
    inProgressTours: tours.filter((t) => t.tourStatus === "IN_PROGRESS").length,
    completedTours: tours.filter((t) => t.tourStatus === "COMPLETED").length,
    totalBookings: tours.reduce((sum, t) => sum + (t.totalBookings || 0), 0),
    totalFavorites: tours.reduce((sum, t) => sum + (t.favoriteCount || 0), 0),
    totalRevenue: totalRevenue || 0,
    availableSpots: tours.reduce((sum, t) => sum + (t.quantity || 0), 0),
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

  // Recent tours (5 newest by startDate)
  const recentTours = [...tours]
    .sort((a, b) => {
      const dateA = a.startDate
        ? a.startDate.split("/").reverse().join("-")
        : "1970-01-01";
      const dateB = b.startDate
        ? b.startDate.split("/").reverse().join("-")
        : "1970-01-01";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  // Popular tours (5 most booked)
  const popularTours = [...tours]
    .sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
    .slice(0, 5);

  // Top destinations
  const destinationStats = tours.reduce((acc: Record<string, number>, tour) => {
    const dest = tour.destination || "Khác";
    acc[dest] = (acc[dest] || 0) + (tour.totalBookings || 0);
    return acc;
  }, {});

  const topDestinations = Object.entries(destinationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, bookings]) => ({ name, bookings }));

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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Chào mừng trở lại, Admin! 👋
          </h1>
          <p className="text-indigo-100 text-lg">
            Đây là tổng quan về hệ thống tour du lịch của bạn
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.isIncrease ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.isIncrease ? (
                    <ArrowUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Phân Bố Trạng Thái Tour
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Đang mở booking
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.openTours}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalTours > 0
                        ? (stats.openTours / stats.totalTours) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Đang thực hiện
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {stats.inProgressTours}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalTours > 0
                        ? (stats.inProgressTours / stats.totalTours) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Đã hoàn thành
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {stats.completedTours}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalTours > 0
                        ? (stats.completedTours / stats.totalTours) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Thống Kê Doanh Thu
            </h2>
          </div>
          <div className="mt-4 w-full h-64">
            {monthlyRevenue ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) => `T${m}`}
                    stroke="#6b7280"
                  />

                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                  />

                  <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()} ₫`}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600">Đang tải dữ liệu doanh thu...</p>
            )}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Tours */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Tour Phổ Biến</h2>
            </div>
            <Link
              to="/admin/tours"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="space-y-3">
            {popularTours.map((tour, index) => (
              <div
                key={tour.tourId}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {tour.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{tour.destination}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-indigo-600">
                    {tour.totalBookings}
                  </p>
                  <p className="text-xs text-gray-500">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tours */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Tour Mới Nhất</h2>
            </div>
            <Link
              to="/admin/tours/create"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Thêm tour →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTours.map((tour) => (
              <div
                key={tour.tourId}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div
                  className={`
                  flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    tour.tourStatus === "OPEN_BOOKING"
                      ? "bg-green-100 text-green-700"
                      : tour.tourStatus === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                >
                  {tour.tourStatus === "OPEN_BOOKING"
                    ? "Mở"
                    : tour.tourStatus === "IN_PROGRESS"
                    ? "Đang chạy"
                    : "Hoàn thành"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {tour.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{tour.destination}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {tour.priceAdult.toLocaleString()}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Destinations */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Điểm Đến Phổ Biến</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topDestinations.map((dest, index) => (
            <div
              key={dest.name}
              className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-indigo-600">
                  #{index + 1}
                </span>
                <Clock className="text-indigo-400" size={16} />
              </div>
              <p className="font-semibold text-gray-900 truncate">
                {dest.name}
              </p>
              <p className="text-sm text-gray-600">{dest.bookings} bookings</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
