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

export interface TourSummaryArray {
  summaryId: string;
  summaries: TourSummary[];
}

// ChatResponse cho các tool hướng dẫn (text)
export interface ChatResponse {
  answer: string;
}

/**
 * Gửi message đến backend và nhận về TourSummary hoặc ChatResponse hoặc TourSummaryArray
 */
export const sendChatMessage = async (
  message: string
): Promise<TourSummary | ChatResponse | TourSummaryArray> => {
  const res = await api.post<ApiResponse<any>>("/ai/chat", { message });
  let result = res.data.result;

  let parsed: any;

  // Nếu result là string → thử JSON.parse
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = result;
    }
  } else {
    parsed = result;
  }

  // --- 1) Nếu là TourSummary ---
  if (
    parsed &&
    typeof parsed === "object" &&
    "tourId" in parsed &&
    "summary" in parsed
  ) {
    return parsed as TourSummary;
  }

  // --- 2) Nếu là TourSummaryArray (summaryId + summaries[]) ---
  if (
    parsed &&
    typeof parsed === "object" &&
    "summaryId" in parsed &&
    Array.isArray(parsed.summaries)
  ) {
    return parsed as TourSummaryArray;
  }

  // --- 3) Nếu là ChatResponse (answer: string) ---
  if (parsed && typeof parsed === "object" && "answer" in parsed) {
    const answer =
      typeof parsed.answer === "string"
        ? parsed.answer
        : JSON.stringify(parsed.answer, null, 2);
    return { answer };
  }

  // --- 4) Nếu backend trả về plain string ---
  return { answer: String(parsed) };
};
