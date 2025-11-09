import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { ReviewRequest, ReviewResponse } from "../types/review";

/**
 * Tạo đánh giá mới
 */
export const createReview = async (
  data: ReviewRequest
): Promise<ReviewResponse> => {
  const response = await api.post<ApiResponse<ReviewResponse>>(
    "/reviews",
    data
  );
  return response.data.result;
};

/**
 * Lấy thông tin một đánh giá
 */
export const getReview = async (reviewId: string): Promise<ReviewResponse> => {
  const response = await api.get<ApiResponse<ReviewResponse>>(
    `/reviews/${reviewId}`
  );
  return response.data.result;
};

/**
 * Lấy tất cả đánh giá của một tour
 */
export const getReviewsByTour = async (
  tourId: string
): Promise<ReviewResponse[]> => {
  const response = await api.get<ApiResponse<ReviewResponse[]>>(
    `/reviews/tour/${tourId}`
  );
  return response.data.result;
};

/**
 * Lấy tất cả đánh giá của user hiện tại
 */
export const getMyReviews = async (): Promise<ReviewResponse[]> => {
  const response = await api.get<ApiResponse<ReviewResponse[]>>(
    "/reviews/my-reviews"
  );
  return response.data.result;
};

/**
 * Cập nhật đánh giá
 */
export const updateReview = async (
  reviewId: string,
  data: ReviewRequest
): Promise<ReviewResponse> => {
  const response = await api.put<ApiResponse<ReviewResponse>>(
    `/reviews/${reviewId}`,
    data
  );
  return response.data.result;
};

/**
 * Xóa đánh giá
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/reviews/${reviewId}`);
};

