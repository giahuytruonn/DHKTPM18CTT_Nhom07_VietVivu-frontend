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
  rating: number;
  comment: string;
  timestamp: string; // Backend trả về LocalDate ("2023-12-08")
  userId: string;
  
  userName: string;
  userAvatar?: string;
  
  tourId: string;
  tourTitle?: string;
  bookingId?: string;
}