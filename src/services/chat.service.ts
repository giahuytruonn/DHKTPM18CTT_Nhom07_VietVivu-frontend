// src/services/chat.service.ts
import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

/**
 * Backend mới trả về string hoàn chỉnh
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  const res = await api.post<ApiResponse<string>>("/ai/chat", { message });
  return res.data.result;
};
