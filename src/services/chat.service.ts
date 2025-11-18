import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

// TourSummary dùng cho findTour
export interface TourSummary {
  tourId: string;
  summary: {
    name: string;
    priceAdult: string;
    priceChild: string;
    days: string;
    imageUrls: string[];
  };
}

// ChatResponse cho các tool hướng dẫn (text)
export interface ChatResponse {
  answer: string;
}

/**
 * Gửi message đến backend và nhận về TourSummary hoặc ChatResponse
 */
export const sendChatMessage = async (
  message: string
): Promise<TourSummary | ChatResponse> => {
  const res = await api.post<ApiResponse<any>>("/ai/chat", { message });
  let result = res.data.result;

  let parsed: any;

  // Nếu result là string → thử JSON.parse
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result);
    } catch {
      // Không parse được → giữ nguyên string
      parsed = result;
    }
  } else {
    // result đã là object từ backend
    parsed = result;
  }

  // --- Nếu là TourSummary ---
  if (parsed && typeof parsed === "object" && "tourId" in parsed) {
    return parsed as TourSummary;
  }

  // --- Nếu là ChatResponse ---
  if (parsed && typeof parsed === "object" && "answer" in parsed) {
    // Nếu answer là object hoặc array → stringify để hiển thị an toàn
    const answer =
      typeof parsed.answer === "string"
        ? parsed.answer
        : JSON.stringify(parsed.answer, null, 2);
    return { answer };
  }

  // --- Nếu backend trả về plain string ---
  return { answer: String(parsed) };
};
