import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromotion, type Promotion } from "../services/promotion.service";
import { ArrowLeft, Calendar, Tag, Percent, Box, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddPromotionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Omit<Promotion, "promotionId">>({
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    status: true,
    quantity: 0,
  });
  const [error, setError] = useState("");

  const descriptionRegex = /^.{1,100}$/;
  const quantityRegex = /^[0-9]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const createMutation = useMutation({
    mutationFn: (promotion: Omit<Promotion, "promotionId">) =>
      createPromotion(promotion as Promotion),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminPromotions"]);
      setForm({ description: "", discount: 0, startDate: "", endDate: "", status: true, quantity: 0 });
      setError("");
      alert("Tạo promotion thành công!");
      navigate("/admin/promotions"); // Quay về danh sách sau khi tạo xong
    },
    onError: (err: any) => setError(err?.message || "Error creating promotion"),
  });

  const handleChange = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !descriptionRegex.test(form.description) ||
      !quantityRegex.test(String(form.quantity)) ||
      !dateRegex.test(form.startDate) ||
      !dateRegex.test(form.endDate)
    ) {
      alert("Vui lòng nhập đúng định dạng các trường!");
      return;
    }

    if (form.discount < 10000) {
      alert("Giá trị giảm giá phải tối thiểu là 10,000 VND!");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start > end) {
      alert("Ngày bắt đầu không được sau ngày kết thúc!");
      return;
    }

    if (end < today) {
      alert("Ngày kết thúc phải sau hôm nay!");
      return;
    }

    createMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate("/admin/promotions")}
            className="mr-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-purple-600 transition-all shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Thêm Mới Khuyến Mãi</h1>
            <p className="text-gray-500 mt-1">Tạo chương trình giảm giá hấp dẫn cho khách hàng</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 text-center border-b border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            
            {/* Section 1: Thông tin cơ bản */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-500" />
                Thông tin chung
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chương trình / Mô tả</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                    placeholder="VD: Khuyến mãi hè 2025 - Giảm 500k"
                  />
                  <p className="text-xs text-gray-400 mt-2 ml-1">Tối đa 100 ký tự</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mức giảm giá (VNĐ)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.discount}
                        onChange={(e) => handleChange("discount", Number(e.target.value))}
                        className="w-full pl-5 pr-12 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-700 font-medium"
                        min={10000}
                        step={1000}
                        placeholder="50000"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">đ</div>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 ml-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Tối thiểu 10,000 đ
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng mã</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => handleChange("quantity", Number(e.target.value))}
                        className="w-full pl-10 pr-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-700"
                        min={0}
                        placeholder="100"
                      />
                      <Box className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Section 2: Thời gian & Trạng thái */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                Thời gian áp dụng
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 bg-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Trạng thái kích hoạt</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange("status", true)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                      form.status 
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm" 
                        : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                    }`}
                  >
                    Hoạt động (Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("status", false)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                      !form.status 
                        ? "border-red-500 bg-red-50 text-red-700 shadow-sm" 
                        : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                    }`}
                  >
                    Tạm dừng (Inactive)
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-700 hover:to-pink-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createMutation.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo Mã Khuyến Mãi Ngay"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromotionsPage;