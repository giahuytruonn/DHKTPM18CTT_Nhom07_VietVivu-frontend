import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTotalRevenue,
  getMonthlyRevenue,
  getRevenueByPaymentMethod,
} from "../services/statistical.service";
import {
  getRevenueByTour,
  type RevenueByTour,
} from "../services/statistical.service"; // thêm hàm này

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#06B6D4", "#EF4444"];

const AdminStatisticsRevenuePage = () => {
  const [year, setYear] = useState(2025);
  const [tourStartTime, setTourStartTime] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10)
  ); // đầu tháng
  const [tourEndTime, setTourEndTime] = useState(
    new Date().toISOString().slice(0, 10)
  ); // hôm nay

  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: getTotalRevenue,
  });

  const { data: monthlyRevenue = [] } = useQuery({
    queryKey: ["monthlyRevenue", year],
    queryFn: () => getMonthlyRevenue(year),
  });

  const { data: revenuePayment = [] } = useQuery({
    queryKey: ["revenuePaymentMethod"],
    queryFn: getRevenueByPaymentMethod,
  });

  // --- Biểu đồ doanh thu theo tour ---
  const { data: revenueByTour = [] } = useQuery<RevenueByTour[]>({
    queryKey: ["revenueByTour", tourStartTime, tourEndTime],
    queryFn: () => getRevenueByTour(tourStartTime, tourEndTime),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>

      {/* Tổng doanh thu */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng doanh thu</h2>
        <p className="text-3xl font-bold text-indigo-600">
          {Number(totalRevenue).toLocaleString()} ₫
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doanh thu theo phương thức thanh toán */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Doanh thu theo phương thức thanh toán
          </h2>
          <div className="w-full h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenuePayment}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {revenuePayment.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doanh thu theo tháng */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Doanh thu theo tháng
            </h2>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} />
                <Tooltip />
                <Line dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Doanh thu theo Tour - dạng bảng xếp hạng có scroll */}
<div className="bg-white p-6 rounded-xl shadow-md mt-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-900">
      Top tour theo doanh thu
    </h2>
    <div className="flex gap-2 items-center">
      <input
        type="date"
        value={tourStartTime}
        onChange={(e) => setTourStartTime(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <span>→</span>
      <input
        type="date"
        value={tourEndTime}
        onChange={(e) => setTourEndTime(e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>
  </div>

  {/* Thêm max-h và scroll */}
  <div className="space-y-2 max-h-96 overflow-y-auto">
    {revenueByTour.map((tour, index) => (
      <div
        key={tour.name}
        className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">{index + 1}.</span>
          <span className="truncate max-w-xs">{tour.name}</span>
        </div>
        <span className="font-bold text-indigo-600">
          {tour.value.toLocaleString()} ₫
        </span>
      </div>
    ))}
  </div>
</div>

</div>
  );
};

export default AdminStatisticsRevenuePage;
