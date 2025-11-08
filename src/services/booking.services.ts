import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

/**
 * Dữ liệu gửi lên để đặt tour
 */
export interface BookingRequest {
  tourId: string;
  userId?: number | null; // có thể null nếu là khách
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
  bookingId: number;
  bookingDate: string;
  totalPrice: number;
  remainingAmount: number;
  discountAmount: number;
  promotionCode: string;
  bookingStatus: string;
  paymentTerm: string;
  tourId: number;
  tourTitle: string;
  tourDuration: string;
  tourDestination: string;
  imageUrl?: string;
  numOfAdults: number;
  numOfChildren: number;
  priceAdult: number;
  priceChild: number;
  totalPriceAdults: number;
  totalPriceChildren: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
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
