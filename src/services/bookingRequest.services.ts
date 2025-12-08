import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

export interface BookingCancelUpdateRequest {
  reason: string;
}

export interface BookingRequestStatusUpdateRequest {
  status: string;
}

export interface BookingStatusUpdateRequestPayload {
  reason: string;
  newTourId?: string;
  promotionId?: string;
}

export interface BookingRequestResponse {
  requestId: string;
  reason: string;
  requestType: "CANCEL" | "CHANGE";
  status: string;
  reviewedAt: string | null;
  createdAt: string;
  adminId: string | null;
  bookingId: string;
  newTourId: string | null;
  oldTourId: string;
  userId: string;
  promotionId?: string | null;
}

/**
 * Hủy booking (tạo booking request để hủy)
 */
export const cancelBooking = async (
  bookingId: string,
  reason: string
): Promise<BookingRequestResponse> => {
  const response = await api.put<ApiResponse<BookingRequestResponse>>(
    `/bookings-request/${bookingId}/cancel-booking`,
    { reason }
  );
  return response.data.result;
};

/**
 * Lấy danh sách booking requests đang chờ xử lý (PENDING_CANCELLATION, PENDING_CHANGE)
 */
export const getPendingRequests = async (): Promise<
  BookingRequestResponse[]
> => {
  const response = await api.get<ApiResponse<BookingRequestResponse[]>>(
    "/bookings-request"
  );
  return response.data.result;
};

/**
 * Lấy chi tiết booking request theo ID
 */
export const getBookingRequestById = async (
  requestId: string
): Promise<BookingRequestResponse> => {
  const response = await api.get<ApiResponse<BookingRequestResponse>>(
    `/bookings-request/${requestId}`
  );
  return response.data.result;
};

/**
 * Cập nhật status của booking request (accept hoặc deny)
 */
export const updateBookingRequestStatus = async (
  requestId: string,
  status: string
): Promise<BookingRequestResponse> => {
  const response = await api.put<ApiResponse<BookingRequestResponse>>(
    `/bookings-request/${requestId}/status`,
    { status }
  );
  return response.data.result;
};
/**
 * Gửi yêu cầu đổi tour
 */
export const requestChangeTour = async (
  bookingId: string,
  newTourId: string,
  reason: string,
  promotionId?: string
): Promise<BookingRequestResponse> => {
  const response = await api.put<ApiResponse<BookingRequestResponse>>(
    `/bookings-request/${bookingId}/change-booking`,
    { newTourId, reason, promotionId }
  );
  return response.data.result;
};
