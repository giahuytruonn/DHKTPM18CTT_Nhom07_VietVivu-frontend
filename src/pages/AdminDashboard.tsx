// src/pages/AdminDashboard.tsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  getTopBookedTours,
  getTopUsers,
  getBookingStatusSummary,
  type TopTour,
  type TopUser,
} from "../services/statistical.service";
import { useAuthStore } from "../stores/useAuthStore";
import { logout as logoutApi } from "../services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const AdminDashboard: React.FC = () => {
  const [bookingStatus, setBookingStatus] = useState("CONFIRMED");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const currentToken = token || localStorage.getItem("token");
      if (currentToken) {
        await logoutApi(currentToken);
      }
    },
    onSuccess: () => {
      toast.info("Đăng xuất thành công!");
    },
    onError: () => {
      toast.error("Lỗi khi đăng xuất!");
    },
    onSettled: () => {
      logout();
      localStorage.clear();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  // React Query
  const { data: topTours, isLoading: loadingTours } = useQuery<TopTour[], Error>({
  queryKey: ["topTours", bookingStatus],
  queryFn: () => getTopBookedTours(bookingStatus),
});

const { data: topUsers, isLoading: loadingUsers } = useQuery<TopUser[], Error>({
  queryKey: ["topUsers", bookingStatus],
  queryFn: () => getTopUsers(bookingStatus),
});

const { data: bookingSummary, isLoading: loadingSummary } = useQuery<
  { name: string; value: number }[],
  Error
>({
  queryKey: ["bookingSummary"],
  queryFn: () => getBookingStatusSummary(),
});


  const loading = loadingTours || loadingUsers || loadingSummary;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }



  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className={`${
          logoutMutation.isPending
            ? "bg-red-300"
            : "bg-red-500 hover:bg-red-600"
        } text-white px-4 py-2 rounded-lg transition`}
      >
        {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Admin Dashboard
      </h1>
    

      {/* Bộ chọn trạng thái */}
      <div className="flex items-center gap-3 mb-6">
        <label className="font-semibold text-gray-700">
          Trạng thái đặt tour:
        </label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={bookingStatus}
          onChange={(e) => setBookingStatus(e.target.value)}
        >
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Lưới thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Tour */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            🏆 Top Tour được đặt nhiều nhất
          </h2>
          {topTours && topTours.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTours}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm italic">Không có dữ liệu.</p>
          )}
        </div>

        {/* Top Users */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            👥 Top Khách hàng
          </h2>
          {topUsers && topUsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topUsers}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm italic">Không có dữ liệu.</p>
          )}
        </div>

        {/* Tổng số booking theo trạng thái */}
        <div className="bg-white p-6 rounded-2xl shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            📦 Tổng số đơn theo trạng thái
          </h2>
          {bookingSummary && bookingSummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingSummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {bookingSummary.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm italic">Không có dữ liệu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
