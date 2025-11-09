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
  userId: number;
  userName: string;
  tourId: string;
  tourTitle: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

