import api from "./api"; // hoặc file cấu hình axios của bạn

interface ContactRequest {
  customerName: string;
  customerEmail: string;
  topic: string;
  message: string;
}

export interface ContactResponse {
  contactId: string;
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
  bookingId: string;
  bookingStatus: string;
  bookingDate: string;
  totalPrice: number;
  numAdults: number;
  numChildren: number;
  tourId: string;
  tourTitle: string;
  tourDestination: string;
}

export interface PaginationContactResponse {
  items: ContactResponse[];
  currentPage: number;
  pageSizes: number;
  totalItems: number;
  totalPages: number;
}

export const sendContactRequest = async (data: ContactRequest) => {
  const response = await api.post("/contact/send", data);
  return response.data;
};

// Admin API endpoints
export const getAllContacts = async (
  page: number = 0,
  size: number = 10
): Promise<PaginationContactResponse> => {
  const response = await api.get(`/contact/admin/all?page=${page}&size=${size}`);
  return response.data.result;
};

export const getContactById = async (
  contactId: string
): Promise<ContactResponse> => {
  const response = await api.get(`/contact/admin/${contactId}`);
  return response.data.result;
};

export const cancelBookingByContact = async (
  contactId: string,
  reason?: string
): Promise<ContactResponse> => {
  const response = await api.post(`/contact/admin/${contactId}/cancel`, {
    reason: reason || "Hủy bởi Admin",
  });
  return response.data.result;
};
