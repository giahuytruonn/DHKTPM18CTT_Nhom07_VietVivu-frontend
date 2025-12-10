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

// ChatResponse cho text
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

  // Nếu backend trả string → thử parse JSON
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = result;
    }
  } else {
    parsed = result;
  }

  // --- 1) TourSummary ---
  if (
    parsed &&
    typeof parsed === "object" &&
    "tourId" in parsed &&
    "summary" in parsed
  ) {
    return parsed as TourSummary;
  }

  // --- 2) ChatResponse ---
  if (parsed && typeof parsed === "object" && "answer" in parsed) {
    return {
      answer:
        typeof parsed.answer === "string"
          ? parsed.answer
          : JSON.stringify(parsed.answer, null, 2),
    };
  }

  // --- fallback text ---
  return { answer: String(parsed) };
};
