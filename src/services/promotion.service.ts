// src/services/promotion.service.ts
import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

export interface Promotion {
  promotionId: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: boolean;
  quantity: number;
}

/**
 * Lấy tất cả promotions (public)
 */
export const getAllPromotions = async (): Promise<Promotion[]> => {
  const response = await api.get<ApiResponse<Promotion[]>>("/promotions");
  return response.data.result;
};

/**
 * Lấy tất cả promotions cho admin
 */
export const getAllPromotionsAdmin = async (): Promise<Promotion[]> => {
  const response = await api.get<ApiResponse<Promotion[]>>("/promotions/admin/all");
  return response.data.result;
};

/**
 * Lấy chi tiết một promotion theo ID
 */
export const getPromotionById = async (promotionId: string): Promise<Promotion> => {
  const response = await api.get<ApiResponse<Promotion>>(`/promotions/${promotionId}`);
  return response.data.result;
};

/**
 * Tìm kiếm promotions theo keyword
 */
export const searchPromotions = async (keyword: string): Promise<Promotion[]> => {
  const response = await api.get<ApiResponse<Promotion[]>>("/promotions/search", {
    params: { keyword },
  });
  return response.data.result;
};

/**
 * Tạo mới promotion
 */
export const createPromotion = async (promotion: Promotion): Promise<Promotion> => {
  const response = await api.post<ApiResponse<Promotion>>("/promotions/create", promotion);
  return response.data.result;
};

/**
 * Cập nhật promotion
 */
export const updatePromotion = async (promotion: Promotion): Promise<Promotion> => {
  const response = await api.put<ApiResponse<Promotion>>(`/promotions/${promotion.promotionId}`, promotion);
  return response.data.result;
};

/**
 * Xóa promotion
 */
export const deletePromotion = async (promotionId: string): Promise<void> => {
  await api.delete(`/promotions/${promotionId}`);
};

/**
 * Cập nhật trạng thái promotion (Active/Inactive)
 * PATCH /promotions/{promotionId}/status?status=true|false
 */
export const togglePromotionStatus = async (promotionId: string, status: boolean): Promise<Promotion> => {
  const response = await api.put<ApiResponse<Promotion>>(
    `/promotions/${promotionId}/status`,
    null,
    { params: { status } } // truyền status dưới query param
  );
  return response.data.result;
};
