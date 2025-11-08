// src/services/payments.ts
import api from "./api";

interface PaymentRequest {
  tourId: number;
  description: string;
  amount: number;
}

interface CheckoutResponse {
  checkoutUrl: string;
  qrCode?: string;
  orderCode?: number;
}

export interface PaymentSuccessPayload {
  bookingId: string;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  paymentStatus: string;
}

export const createPaymentLink = async (
  data: PaymentRequest
): Promise<CheckoutResponse> => {
  const response = await api.post("/payment/create", data);
  return response.data.result;
};

export const savePaymentSuccess = (data: PaymentSuccessPayload) => {
  return api.post("/payment/success", data);
};
