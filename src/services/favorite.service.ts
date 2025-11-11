// src/services/favorite.service.ts
import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse } from "../types/tour";

/**
 * Thêm tour vào danh sách yêu thích
 */
export const addToFavorites = async (tourId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/users/favorite-tours/${tourId}`);
};

/**
 * Xóa tour khỏi danh sách yêu thích
 */
export const removeFromFavorites = async (tourId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/users/favorite-tours/${tourId}`);
};

/**
 * Lấy danh sách tour yêu thích của user hiện tại
 */
export const getMyFavoriteTours = async (): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/users/favorite-tours");
  return res.data.result;
};