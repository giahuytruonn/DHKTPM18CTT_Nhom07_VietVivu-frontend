// src/services/tour.service.ts
import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse, TourStatus } from "../types/tour";

// Response type cho phân trang
export interface PaginatedToursResponse {
  items: TourResponse[];
  currentPage: number;
  pageSizes: number;
  totalItems: number;
  totalPages: number;
}

// Get all tours (public - chỉ OPEN_BOOKING) - PHÂN TRANG
export const getTours = async (page: number = 0, size: number = 10): Promise<PaginatedToursResponse> => {
  const res = await api.get<ApiResponse<PaginatedToursResponse>>("/tours", {
    params: { page, size }
  });
  return res.data.result;
};

// Get all tours for admin (tất cả tours) - PHÂN TRANG
export const getAllToursAdmin = async (page: number = 0, size: number = 10): Promise<PaginatedToursResponse> => {
  const res = await api.get<ApiResponse<PaginatedToursResponse>>("/tours/admin/all", {
    params: { page, size }
  });
  return res.data.result;
};

// Get tour by ID (không đổi)
export const getTourById = async (tourId: string): Promise<TourResponse> => {
  const res = await api.get<ApiResponse<TourResponse>>(`/tours/${tourId}`);
  return res.data.result;
};

// Search params interface
export interface TourSearchParams {
  keyword?: string | null;
  destination?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  startDate?: string | null;
  durationDays?: number | null;
  minQuantity?: number | null;
  tourStatus?: TourStatus | null;
}

// Search tours - PHÂN TRANG
export const searchTours = async (
  params: TourSearchParams,
  page: number = 0,
  size: number = 10
): Promise<PaginatedToursResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  );

  const res = await api.get<ApiResponse<PaginatedToursResponse>>("/tours/search", {
    params: { ...cleanParams, page, size }
  });
  return res.data.result;
};

// Xóa tour (chỉ Admin)
export const deleteTour = async (tourId: string): Promise<void> => {
  await api.delete(`/tours/${tourId}`);
};

export interface ITourSelection {
  id: string;
  title: string;
}

// Hàm gọi API lấy danh sách tour
export const getAllTourNames = async (): Promise<ITourSelection[]> => {
  const response = await api.get<ITourSelection[]>("/tours/all-names"); 
  return response.data;
};