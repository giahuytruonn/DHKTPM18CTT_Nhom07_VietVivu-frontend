import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type {
  FavoriteTourRequest,
  FavoriteTourResponse,
  FavoriteTourCheckResponse,
} from "../types/favorite";

/**
 * Thêm tour vào danh sách yêu thích
 */
export const addFavoriteTour = async (
  data: FavoriteTourRequest
): Promise<FavoriteTourResponse> => {
  const response = await api.post<ApiResponse<FavoriteTourResponse>>(
    "/favorite-tours",
    data
  );
  return response.data.result;
};

/**
 * Xóa tour khỏi danh sách yêu thích
 */
export const removeFavoriteTour = async (
  tourId: string
): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/favorite-tours/${tourId}`);
};

/**
 * Lấy danh sách tour yêu thích của user hiện tại
 */
export const getFavoriteTours = async (): Promise<FavoriteTourResponse> => {
  const response = await api.get<ApiResponse<FavoriteTourResponse>>(
    "/favorite-tours"
  );
  return response.data.result;
};

/**
 * Kiểm tra tour có trong danh sách yêu thích không
 */
export const checkFavoriteTour = async (
  tourId: string
): Promise<FavoriteTourCheckResponse> => {
  const response = await api.get<ApiResponse<FavoriteTourCheckResponse>>(
    `/favorite-tours/${tourId}/check`
  );
  return response.data.result;
};

