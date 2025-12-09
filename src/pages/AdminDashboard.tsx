import React, { useMemo } from "react";
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

import StatCard from '../components/admin/StatCard';
import TourStatusBar from '../components/admin/TourStatusBar';
import PopularTourItem from '../components/admin/PopularTourItem';
import RecentTourItem from '../components/admin/RecentTourItem';
import DestinationCard from '../components/admin/DestinationCard';

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

  const tours = useMemo(() => {
    return toursResponse?.items || [];
  }, [toursResponse]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalTours: tours.length,
      openTours: tours.filter((t) => t.tourStatus === "OPEN_BOOKING").length,
      inProgressTours: tours.filter((t) => t.tourStatus === "IN_PROGRESS").length,
      completedTours: tours.filter((t) => t.tourStatus === "COMPLETED").length,
      totalBookings: tours.reduce((sum, t) => sum + (t.totalBookings || 0), 0),
      totalFavorites: tours.reduce((sum, t) => sum + (t.favoriteCount || 0), 0),
      totalRevenue: totalRevenue || 0,
      availableSpots: tours.reduce((sum, t) => sum + (t.quantity || 0), 0),
    };
  }, [tours, totalRevenue]);

  const statCards = useMemo(() => [
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
  ], [stats]);

  // Recent tours (5 newest by startDate)
  const recentTours = useMemo(() => {
    return [...tours]
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
  }, [tours]);

  // Popular tours (5 most booked)
  const popularTours = useMemo(() => {
    return [...tours]
      .sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
      .slice(0, 5);
  }, [tours]);

  // Top destinations
  const topDestinations = useMemo(() => {
    const destinationStats = tours.reduce((acc: Record<string, number>, tour) => {
      const dest = tour.destination || "Khác";
      acc[dest] = (acc[dest] || 0) + (tour.totalBookings || 0);
      return acc;
    }, {});

    return Object.entries(destinationStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, bookings]) => ({ name, bookings }));
  }, [tours]);

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
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isIncrease={stat.isIncrease}
            icon={stat.icon}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
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
            <TourStatusBar
              label="Đang mở booking"
              value={stats.openTours}
              total={stats.totalTours}
              color="bg-gradient-to-r from-green-400 to-green-600"
              textColor="text-green-600"
            />
            <TourStatusBar
              label="Đang thực hiện"
              value={stats.inProgressTours}
              total={stats.totalTours}
              color="bg-gradient-to-r from-blue-400 to-blue-600"
              textColor="text-blue-600"
            />
            <TourStatusBar
              label="Đã hoàn thành"
              value={stats.completedTours}
              total={stats.totalTours}
              color="bg-gradient-to-r from-gray-400 to-gray-600"
              textColor="text-gray-600"
            />
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
              <PopularTourItem
                key={tour.tourId}
                tour={tour}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Recent Tours */}
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
              <RecentTourItem
                key={tour.tourId}
                tour={tour}
              />
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
            <DestinationCard
              key={dest.name}
              destination={dest}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
