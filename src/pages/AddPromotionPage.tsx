import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromotion, type Promotion } from "../services/promotion.service";

const AddPromotionsPage: React.FC = () => {
  const queryClient = useQueryClient();
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
  const discountRegex = /^(100|[1-9]?[0-9])$/;
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
    },
    onError: (err: any) => setError(err?.message || "Error creating promotion"),
  });

  const handleChange = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !descriptionRegex.test(form.description) ||
      !discountRegex.test(String(form.discount)) ||
      !quantityRegex.test(String(form.quantity)) ||
      !dateRegex.test(form.startDate) ||
      !dateRegex.test(form.endDate)
    ) {
      alert("Vui lòng nhập đúng định dạng các trường!");
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
    <div className="min-h-screen flex justify-center items-start py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-purple-600 mb-6 text-center">
          Thêm mới Promotion
        </h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mô tả promotion"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => handleChange("discount", Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={form.status ? "true" : "false"}
              onChange={(e) => handleChange("status", e.target.value === "true")}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition"
          >
            {createMutation.isLoading ? "Đang tạo..." : "Tạo Promotion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPromotionsPage;
