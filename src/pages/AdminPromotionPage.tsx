import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tag, Calendar, Box, CheckCircle, XCircle, Power, Copy } from "lucide-react";
import {
  getAllPromotionsAdmin,
  togglePromotionStatus,
  type Promotion,
} from "../services/promotion.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng

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
    p.description.toLowerCase().includes(searchId.toLowerCase()) ||
    p.promotionId.toLowerCase().includes(searchId.toLowerCase())
  );

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      togglePromotionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPromotions"] });
      toast.success("Cập nhật trạng thái thành công");
    },
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Đã sao chép mã khuyến mãi!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
              Quản Lý Khuyến Mãi
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Danh sách các chương trình ưu đãi hiện có
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/80 backdrop-blur-sm"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors w-5 h-5" />
            </div>
            
            <button
              onClick={() => navigate("/admin/promotions/create")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo Mới</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">Chưa có chương trình nào</h3>
            <p className="text-gray-500 mt-1">Hãy tạo khuyến mãi đầu tiên để thu hút khách hàng!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPromotions.map((promo) => (
              <div
                key={promo.promotionId}
                className="group relative bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/50 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        promo.status 
                            ? "bg-green-50 text-green-600 border-green-200" 
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                    >
                        {promo.status ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {promo.status ? "Hoạt động" : "Tạm dừng"}
                    </span>
                    </div>

                    {/* ID & Title */}
                    <div className="mb-5 pr-20">
                        {/* --- SỬA ĐỔI Ở ĐÂY: HIỂN THỊ FULL ID --- */}
                        <div 
                            className="inline-flex items-center gap-2 mb-2 max-w-full cursor-pointer hover:bg-purple-50 px-2 py-1 rounded-lg -ml-2 transition-colors group/id"
                            onClick={() => handleCopyId(promo.promotionId)}
                            title="Nhấn để sao chép mã"
                        >
                            <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">MÃ:</span>
                            <span className="text-xs font-mono text-purple-600 font-medium break-all select-all">
                                {promo.promotionId}
                            </span>
                            <Copy className="w-3 h-3 text-gray-300 group-hover/id:text-purple-500 opacity-0 group-hover/id:opacity-100 transition-all shrink-0" />
                        </div>
                        {/* -------------------------------------- */}

                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
                            {promo.description}
                        </h2>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-6">
                        {/* Discount Box */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                <Tag className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-purple-400 font-semibold uppercase">Giảm giá</p>
                                <p className="text-lg font-bold text-purple-700">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.discount)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Thời hạn</span>
                                    <span className="text-xs font-medium text-gray-600">
                                        {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <Box className="w-4 h-4 text-gray-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Số lượng</span>
                                    <span className="text-xs font-medium text-gray-600">
                                        {promo.quantity} mã
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium">NGÀY BẮT ĐẦU</span>
                        <span className="text-xs text-gray-600 font-medium">
                            {new Date(promo.startDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    
                    <button
                        onClick={() => toggleStatusMutation.mutate({ id: promo.promotionId, status: !promo.status })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                            promo.status 
                                ? "bg-white text-red-600 border border-red-200 hover:bg-red-50" 
                                : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
                        }`}
                    >
                        <Power className="w-4 h-4" />
                        {promo.status ? "Dừng" : "Kích hoạt"}
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