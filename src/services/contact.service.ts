import api from "./api"; // hoặc file cấu hình axios của bạn

interface ContactRequest {
  customerName: string;
  customerEmail: string;
  topic: string;
  message: string;
}

export const sendContactRequest = async (data: ContactRequest) => {
  const response = await api.post("/contact/send", data);
  return response.data;
};