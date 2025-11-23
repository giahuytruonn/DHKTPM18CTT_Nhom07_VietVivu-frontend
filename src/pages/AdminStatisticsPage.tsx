import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getTopBookedTours,
  getTopUsers,
  getBookingStatusSummary,
  type TopTour,
  type TopUser,
} from "../services/statistical.service";
import {
  BarChart3,
  Users,
  Package,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react";

const COLORS = {
  primary: ["#6366f1", "#8b5cf6"], // indigo-purple
  blue: ["#3b82f6", "#2563eb"],
  green: ["#10b981", "#059669"],
  purple: ["#8b5cf6", "#7c3aed"],
  orange: ["#f59e0b", "#d97706"],
  pink: ["#ec4899", "#db2777"],
};

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const AdminStatisticsPage: React.FC = () => {
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<string>("ALL");

  // Fetch booking status summary
  const { data: bookingStatusData = [], isLoading: isLoadingStatus } = useQuery({
    queryKey: ["bookingStatusSummary"],
    queryFn: getBookingStatusSummary,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top booked tours
  const {
    data: topToursData = [],
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useQuery({
    queryKey: ["topBookedTours", selectedBookingStatus],
    queryFn: () => getTopBookedTours(selectedBookingStatus === "ALL" ? "" : selectedBookingStatus),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top users
  const {
    data: topUsersData = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["topUsers", selectedBookingStatus],
    queryFn: () => getTopUsers(selectedBookingStatus === "ALL" ? "" : selectedBookingStatus),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingStatus || isLoadingTours || isLoadingUsers;

  const handleRefresh = () => {
    refetchTours();
    refetchUsers();
  };

  // Format data for pie chart (booking status)
  const pieChartData = bookingStatusData.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  // Format data for bar charts
  const topToursChartData = topToursData.slice(0, 10).map((tour) => ({
    name: tour.name.length > 20 ? tour.name.substring(0, 20) + "..." : tour.name,
    fullName: tour.name,
    value: tour.value,
  }));

  const topUsersChartData = topUsersData.slice(0, 10).map((user) => ({
    name: user.name.length > 20 ? user.name.substring(0, 20) + "..." : user.name,
    fullName: user.name,
    value: user.value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {payload[0].payload.fullName || payload[0].payload.name}
          </p>
          <p className="text-indigo-600 font-medium">
            {payload[0].name}: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 size={32} />
              Thống Kê & Báo Cáo
            </h1>
            <p className="text-indigo-100 text-sm md:text-base">
              Phân tích dữ liệu booking và người dùng của hệ thống
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
          >
            <RefreshCw size={18} />
            <span className="font-medium">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={20} className="text-indigo-600" />
            <span className="font-semibold">Lọc theo trạng thái:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedBookingStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedBookingStatus === status
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "ALL"
                  ? "Tất cả"
                  : status === "PENDING"
                  ? "Chờ xử lý"
                  : status === "CONFIRMED"
                  ? "Đã xác nhận"
                  : status === "COMPLETED"
                  ? "Hoàn thành"
                  : "Đã hủy"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Package className="text-indigo-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng Booking</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {bookingStatusData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Top Tours</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {topToursData.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Top Users</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {topUsersData.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Trạng thái</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {bookingStatusData.length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Booking Status Pie Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
            Phân Bố Booking Theo Trạng Thái
          </h2>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-900">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-indigo-600 font-medium">
                            Số lượng: {payload[0].value.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Top Tours Bar Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
            Top Tours Được Đặt Nhiều Nhất
          </h2>
          {topToursChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topToursChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                >
                  {topToursChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Top Users Bar Chart */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
          Top Khách Hàng Đặt Tour Nhiều Nhất
        </h2>
        {topUsersChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topUsersChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="url(#colorGradient2)"
                radius={[0, 8, 8, 0]}
              >
                {topUsersChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Tours Table */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
            Bảng Xếp Hạng Tours
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    STT
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tên Tour
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Số Lượng
                  </th>
                </tr>
              </thead>
              <tbody>
                {topToursData.slice(0, 10).map((tour, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{tour.name}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-indigo-600">
                        {tour.value.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {topToursData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Users Table */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
            Bảng Xếp Hạng Khách Hàng
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    STT
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tên Khách Hàng
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Số Lượng
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsersData.slice(0, 10).map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-purple-600">
                        {user.value.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {topUsersData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;

