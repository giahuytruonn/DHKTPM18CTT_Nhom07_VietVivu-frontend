import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  getTopBookedTours,
  getTopUsers,
  getBookingStatusSummary,
  type TopTour,
  type TopUser,
} from "../services/statistical.service";
import { BarChart3, Filter, RefreshCw } from "lucide-react";

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

const STATUS_VI_MAP: Record<string, string> = {
  ALL: "Tất cả",
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const AdminStatisticsPage: React.FC = () => {
  // Filters
  const [filterStatusSummary, setFilterStatusSummary] = useState("ALL");
  const [filterStatusTours, setFilterStatusTours] = useState("ALL");
  const [filterUserTable, setFilterUserTable] = useState<
    "BOOKED" | "CANCELLED"
  >("BOOKED");

  // Booking status summary
  const {
    data: bookingStatusRaw = [],
    isLoading: isLoadingStatus,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["bookingStatusSummary"],
    queryFn: getBookingStatusSummary,
    staleTime: 1000 * 60 * 5,
  });

  const bookingStatusData =
    filterStatusSummary === "ALL"
      ? bookingStatusRaw
      : bookingStatusRaw.filter((item: any) =>
          [item.name, item.code]
            .map((x) => (x ?? "").toLowerCase())
            .some((x) =>
              x.includes(filterStatusSummary.toLowerCase())
            )
        );

  // Top booked tours
  const {
    data: topToursData = [],
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useQuery({
    queryKey: ["topBookedTours", filterStatusTours],
    queryFn: () =>
      getTopBookedTours(filterStatusTours === "ALL" ? "" : filterStatusTours),
    staleTime: 1000 * 60 * 5,
  });

  // Ranking users table
  const { data: rankingUsers = [] } = useQuery({
    queryKey: ["rankingUsers", filterUserTable],
    queryFn: () =>
      getTopUsers(
        filterUserTable === "BOOKED" ? "CONFIRMED" : "CANCELLED"
      ),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingStatus || isLoadingTours;

  const handleRefresh = () => {
    refetchBooking();
    refetchTours();
  };

  // Chart data
  const pieChartData = bookingStatusData.map((item: any) => ({
    name: item.name ?? item.status ?? item.code ?? "Unknown",
    value: item.value ?? item.count ?? 0,
  }));

  const topToursChartData = (topToursData as TopTour[])
    .slice(0, 10)
    .map((tour) => ({
      name:
        tour.name.length > 20
          ? tour.name.substring(0, 20) + "..."
          : tour.name,
      fullName: tour.name,
      value: tour.value ?? 0,
    }));

  const topUsersChartData = (rankingUsers as TopUser[])
    .slice(0, 10)
    .map((user) => ({
      name:
        user.name.length > 20
          ? user.name.substring(0, 20) + "..."
          : user.name,
      fullName: user.name,
      value: user.value ?? 0,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {payload[0].payload.fullName}
          </p>
          <p className="text-indigo-600 font-medium">
            {Number(payload[0].value).toLocaleString()}
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
              Phân tích dữ liệu booking và người dùng
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Booking Status */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Phân Bố Booking Theo Trạng Thái
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-indigo-600" />
              <div className="flex gap-2 flex-wrap">
                {STATUS_LIST.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatusSummary(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterStatusSummary === status
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {STATUS_VI_MAP[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {pieChartData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
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

        {/* Top Tours */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Top Tours Được Đặt Nhiều Nhất
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-indigo-600" />
              <div className="flex gap-2 flex-wrap">
                {STATUS_LIST.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatusTours(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterStatusTours === status
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {STATUS_VI_MAP[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {topToursChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topToursChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {topToursChartData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
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
      </div>

      {/* User Ranking */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Bảng Xếp Hạng Khách Hàng
          </h2>

          <select
            value={filterUserTable}
            onChange={(e) =>
              setFilterUserTable(e.target.value as "BOOKED" | "CANCELLED")
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm font-bold"
          >
            <option value="BOOKED">Đặt nhiều nhất</option>
            <option value="CANCELLED">Hủy nhiều nhất</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">STT</th>
                <th className="text-left py-3 px-4">Tên khách hàng</th>
                <th className="text-right py-3 px-4">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {rankingUsers.slice(0, 10).map((user: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-600">
                    {Number(user.value).toLocaleString()}
                  </td>
                </tr>
              ))}

              {rankingUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;
