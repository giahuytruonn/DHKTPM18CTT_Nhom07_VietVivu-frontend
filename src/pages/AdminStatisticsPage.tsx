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
  ResponsiveContainer,
} from "recharts";
import {
  getTopBookedTours,
  getTopUsers,
  getBookingStatusSummary,
  getTotalRevenue,
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

const STATUS_LIST = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const AdminStatisticsPage: React.FC = () => {
  // --- Filters (separate for each dashboard) ---
  const [filterStatusSummary, setFilterStatusSummary] = useState<string>("ALL");
  const [filterStatusTours, setFilterStatusTours] = useState<string>("ALL");
  const [filterStatusUsers, setFilterStatusUsers] = useState<string>("ALL");

  // --- Booking status summary (fetch once, filter client-side) ---
  const {
    data: bookingStatusRaw = [],
    isLoading: isLoadingStatus,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["bookingStatusSummary"],
    queryFn: getBookingStatusSummary,
    staleTime: 1000 * 60 * 5,
  });

  // Filter booking data locally so summary filter doesn't affect other dashboards
  const bookingStatusData =
    filterStatusSummary === "ALL"
      ? bookingStatusRaw
      : bookingStatusRaw.filter((item: any) => {
          // try to match on different possible fields (name or code)
          const s = filterStatusSummary.toLowerCase();
          const name = String(item.name || "").toLowerCase();
          const code = String(item.code || "").toLowerCase();
          return name.includes(s) || code.includes(s);
        });

  // --- Top booked tours (filtered by filterStatusTours) ---
  const {
    data: topToursData = [],
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useQuery({
    queryKey: ["topBookedTours", filterStatusTours],
    queryFn: () =>
      getTopBookedTours(filterStatusTours === "ALL" ? "" : filterStatusTours),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  // --- Top users (filtered by filterStatusUsers) ---
  const {
    data: topUsersData = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["topUsers", filterStatusUsers],
    queryFn: () =>
      getTopUsers(filterStatusUsers === "ALL" ? "" : filterStatusUsers),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: totalRevenue = 0,
    isLoading: isLoadingRevenue,
    refetch: refetchRevenue,
  } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: getTotalRevenue,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading =
    isLoadingStatus || isLoadingTours || isLoadingUsers || isLoadingRevenue;

  // Refresh all three sections
  const handleRefresh = () => {
    refetchBooking();
    refetchTours();
    refetchUsers();
    refetchRevenue();
  };

  // --- Prepare chart data ---
  const pieChartData = (bookingStatusData || []).map((item: any) => ({
    name: item.name ?? item.status ?? item.code ?? "Unknown",
    value: item.value ?? item.count ?? 0,
  }));

  const topToursChartData = (topToursData as TopTour[] | any[])
    .slice(0, 10)
    .map((tour) => ({
      name:
        typeof tour.name === "string" && tour.name.length > 20
          ? tour.name.substring(0, 20) + "..."
          : tour.name,
      fullName: tour.name,
      value: tour.value ?? 0,
    }));

  const topUsersChartData = (topUsersData as TopUser[] | any[])
    .slice(0, 10)
    .map((user) => ({
      name:
        typeof user.name === "string" && user.name.length > 20
          ? user.name.substring(0, 20) + "..."
          : user.name,
      fullName: user.name,
      value: user.value ?? 0,
    }));

  // Custom tooltip reused
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {payload[0].payload.fullName || payload[0].payload.name}
          </p>
          <p className="text-indigo-600 font-medium">
            {payload[0].name}: {Number(payload[0].value).toLocaleString()}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Package className="text-indigo-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Tổng Booking
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {(bookingStatusRaw || [])
              .reduce(
                (sum: number, item: any) =>
                  sum + (item.value ?? item.count ?? 0),
                0
              )
              .toLocaleString()}
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
            {bookingStatusRaw.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Tổng Doanh Thu
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {Number(totalRevenue).toLocaleString()} ₫
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Booking Status Chart + Filter (filterStatusSummary) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Phân Bố Booking Theo Trạng Thái
              </h2>
              <p className="text-sm text-gray-500">
                Lọc chỉ ảnh hưởng biểu đồ phân bố này
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-indigo-600" />
              <div className="flex gap-2 flex-wrap">
                {STATUS_LIST.map((status) => (
                  <button
                    key={`summary-${status}`}
                    onClick={() => setFilterStatusSummary(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterStatusSummary === status
                        ? "bg-indigo-600 text-white shadow-sm"
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

          <div className="mt-4">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-900">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-indigo-600 font-medium">
                              Số lượng:{" "}
                              {Number(payload[0].value).toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>

        {/* Top Tours Chart + Filter (filterStatusTours) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Top Tours Được Đặt Nhiều Nhất
              </h2>
              <p className="text-sm text-gray-500">
                Lọc chỉ ảnh hưởng biểu đồ & bảng Tours
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-indigo-600" />
              <div className="flex gap-2 flex-wrap">
                {STATUS_LIST.map((status) => (
                  <button
                    key={`tours-${status}`}
                    onClick={() => setFilterStatusTours(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterStatusTours === status
                        ? "bg-indigo-600 text-white shadow-sm"
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

          <div className="mt-4">
            {topToursChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topToursChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    height={60}
                    tick={(props: any) => {
                      const { x, y, payload } = props;
                      const label: string = payload.value;
                      const short =
                        label.length > 14
                          ? label.substring(0, 14) + "..."
                          : label;
                      const words: string[] = short.split(" ");
                      return (
                        <text
                          x={x}
                          y={y + 10}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#4b5563"
                        >
                          {words.map((w: string, i: number) => (
                            <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                              {w}
                            </tspan>
                          ))}
                        </text>
                      );
                    }}
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
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.8}
                      />
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
      </div>

      {/* Top Users Chart + Filter (filterStatusUsers) */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Top Khách Hàng Đặt Tour Nhiều Nhất
            </h2>
            <p className="text-sm text-gray-500">
              Lọc chỉ ảnh hưởng biểu đồ & bảng Khách Hàng
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-indigo-600" />
            <div className="flex gap-2 flex-wrap">
              {STATUS_LIST.map((status) => (
                <button
                  key={`users-${status}`}
                  onClick={() => setFilterStatusUsers(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filterStatusUsers === status
                      ? "bg-indigo-600 text-white shadow-sm"
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

        <div className="mt-4">
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
                  <linearGradient
                    id="colorGradient2"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
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
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Tours Table (same filterStatusTours) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Bảng Xếp Hạng Tours
            </h2>
            <div className="text-sm text-gray-500">
              Filter: {filterStatusTours}
            </div>
          </div>

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
                {topToursData.slice(0, 10).map((tour: any, index: number) => (
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
                        {Number(tour.value).toLocaleString()}
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

        {/* Top Users Table (same filterStatusUsers) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Bảng Xếp Hạng Khách Hàng
            </h2>
            <div className="text-sm text-gray-500">
              Filter: {filterStatusUsers}
            </div>
          </div>

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
                {topUsersData.slice(0, 10).map((user: any, index: number) => (
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
                        {Number(user.value).toLocaleString()}
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
