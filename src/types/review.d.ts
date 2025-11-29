/**
 * Request để tạo/cập nhật đánh giá
 */
export interface ReviewRequest {
  bookingId: string;
  rating: number; // 1-5
  comment: string;
}

/**
 * Response chứa thông tin đánh giá
 */
export interface ReviewResponse {
  reviewId: string;
  bookingId: string;
  // Backend may return UUID strings for users — use string to match DB values
  userId: string;
  userName: string;
  tourId: string;
  tourTitle: string;
  rating: number;
  comment: string;
  // createdAt may be ISO string or numeric timestamp (ms). The service normalizes
  // LocalDate-like objects to ISO strings. We do not expose updatedAt on frontend.
  createdAt: string | number;
}
