import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse, TourStatus } from "../types/tour";

// Get all tours (public - chỉ OPEN_BOOKING)
export const getTours = async (): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours");
  return res.data.result;
};

// Get all tours for admin (tất cả tours)
export const getAllToursAdmin = async (): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours/admin/all");
  return res.data.result;
};

// Get tour by ID
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

// Search tours
export const searchTours = async (
  params: TourSearchParams
): Promise<TourResponse[]> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  );
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours/search", {
    params: cleanParams,
  });
  return res.data.result;
};


/**
 * Xóa tour (chỉ Admin)
 */
export const deleteTour = async (tourId: string): Promise<void> => {
  await api.delete(`/tours/${tourId}`);
};