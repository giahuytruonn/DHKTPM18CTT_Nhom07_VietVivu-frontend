import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTotalRevenue, getMonthlyRevenue } from "../services/statistical.service";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminStatisticsRevenuePage = () => {
  const [year, setYear] = useState(2025);

  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: getTotalRevenue,
  });

  const { data: monthlyRevenue = [] } = useQuery({
    queryKey: ["monthlyRevenue", year],
    queryFn: () => getMonthlyRevenue(year),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng doanh thu</h2>
        <p className="text-3xl font-bold text-indigo-600">
          {Number(totalRevenue).toLocaleString()} ₫
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h2>
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
  );
};

export default AdminStatisticsRevenuePage;
