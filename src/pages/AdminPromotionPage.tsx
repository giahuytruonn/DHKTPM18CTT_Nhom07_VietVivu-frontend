import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Trash, Plus } from "lucide-react";
import {
  getAllPromotionsAdmin,
  deletePromotion,
  togglePromotionStatus,
  type Promotion,
} from "../services/promotion.service";
import { useNavigate } from "react-router-dom";

const AdminPromotionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["adminPromotions"],
    queryFn: getAllPromotionsAdmin,
    staleTime: 1000 * 60 * 5,
  });

  const promotions: Promotion[] = data || [];

  const filteredPromotions = promotions.filter((p) =>
    p.promotionId.toLowerCase().includes(searchId.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => queryClient.invalidateQueries(["adminPromotions"]),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      togglePromotionStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(["adminPromotions"]),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-extrabold text-purple-700 mb-1">
              Quản lý Promotions
            </h1>
            <p className="text-gray-600">Xem, tìm kiếm và quản lý chương trình khuyến mãi</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tìm theo ID..."
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              onClick={() => navigate("/admin/promotions/create")}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Đang tải...</div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa có promotion nào</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promo) => (
              <div
                key={promo.promotionId}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-gray-500">{promo.promotionId}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      promo.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {promo.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">{promo.description}</h2>
                <p className="text-sm text-gray-600 mb-2">Discount: {promo.discount}%</p>
                <p className="text-sm text-gray-600 mb-2">
                  {promo.startDate} → {promo.endDate}
                </p>
                <p className="text-sm text-gray-600 mb-4">Quantity: {promo.quantity}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatusMutation.mutate({ id: promo.promotionId, status: !promo.status })}
                    className={`flex-1 px-3 py-1 rounded-full text-white font-semibold text-xs ${
                      promo.status ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    } transition`}
                  >
                    {promo.status ? "Ngừng" : "Hoạt động"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromotionsPage;
