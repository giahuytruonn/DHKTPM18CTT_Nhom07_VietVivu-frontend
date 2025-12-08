import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

/**
 * Dữ liệu gửi lên để đặt tour
 */
export interface BookingRequest {
  tourId: string;
  userId?: string | null; // có thể null nếu là khách
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  numOfAdults: number;
  numOfChildren: number;
  promotionId: string;
  bookingDate: string; // ISO date (yyyy-MM-dd)
}

/**
 * Dữ liệu trả về khi đặt tour thành công
 */
export interface BookingResponse {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  bookingId: string;
  bookingDate: string;
  totalPrice: number;
  promotionCode: string;
  discountAmount: number;
  remainingAmount: number;
  bookingStatus: string;
  paymentTerm: string;
  tourId: string;
  tourTitle: string;
  tourDuration: string;
  tourDestination: string;
  imageUrl: string | null;
  numOfAdults: number;
  priceAdult: number;
  totalPriceAdults: number;
  numOfChildren: number;
  priceChild: number;
  totalPriceChildren: number;
}

/**
 * Gọi API để đặt tour
 */
export const bookTour = async (
  data: BookingRequest
): Promise<BookingResponse> => {
  const response = await api.post<ApiResponse<BookingResponse>>(
    "/bookings",
    data
  );
  return response.data.result;
};

/**
 * Lấy danh sách booking của user đăng nhập
 */
export const getBookings = async (): Promise<BookingResponse[]> => {
  const response = await api.get<ApiResponse<BookingResponse[]>>("/bookings");
  return response.data.result;
};


export const getUserBookings = async (userId: string): Promise<BookingResponse[]> => {
  const res = await api.get<ApiResponse<BookingResponse[]>>(`/bookings/user/${userId}`);
  return res.data.result;
};


export const getBookingById = async (
  bookingId: string
): Promise<BookingResponse> => {
  const response = await api.get<ApiResponse<BookingResponse>>(
    `/bookings/${bookingId}`
  );
  return response.data.result;
};

