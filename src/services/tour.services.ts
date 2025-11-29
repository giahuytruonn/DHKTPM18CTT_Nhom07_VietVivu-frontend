import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse } from "../types/tour";

/**
 * Lấy tất cả tour
 */
export const getAllTours = async (): Promise<TourResponse[]> => {
  const response = await api.get<ApiResponse<TourResponse[]>>("/tours");
  return response.data.result;
};

/**
 * Lấy danh sách tour còn available
 */
export const getAvailableTours = async (): Promise<TourResponse[]> => {
  const response = await api.get<ApiResponse<TourResponse[]>>("/tours/available");
  return response.data.result;
};

/**
 * Lấy chi tiết một tour theo ID
 */
export const getTourById = async (tourId: string): Promise<TourResponse> => {
  const response = await api.get<ApiResponse<TourResponse>>(`/tours/${tourId}`);
  return response.data.result;
};

/**
 * Tìm kiếm tour theo keyword
 */
export const searchTours = async (keyword: string): Promise<TourResponse[]> => {
  const response = await api.get<ApiResponse<TourResponse[]>>("/tours/search", {
    params: { keyword },
  });
  return response.data.result;
};

