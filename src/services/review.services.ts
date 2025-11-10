import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { ReviewRequest, ReviewResponse } from "../types/review";

// --- Date normalization helpers -------------------------------------------------
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoStringFromValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    // 'YYYY-MM-DD' -> append time to make it parse consistently
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(value + "T00:00:00");
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value === "object") {
    // LocalDate-like: { year, month, day }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = value as any;
    if (
      typeof obj.year === "number" &&
      typeof obj.month === "number" &&
      typeof obj.day === "number"
    ) {
      const iso = `${obj.year}-${pad(obj.month)}-${pad(obj.day)}T00:00:00`;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    // LocalDateTime-like: { year, month, day, hour, minute, second }
    if (typeof obj.year === "number" && typeof obj.hour === "number") {
      const iso = `${obj.year}-${pad(obj.month)}-${pad(obj.day)}T${pad(
        obj.hour
      )}:${pad(obj.minute ?? 0)}:${pad(obj.second ?? 0)}`;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
  }
  return null;
}

function normalizeReviewDates(review: ReviewResponse): ReviewResponse {
  const copy = { ...review } as ReviewResponse;
  const record = copy as unknown as Record<string, unknown>;
  // createdAt may be present, or backend may use `timestamp` (see DB sample).
  // Prefer createdAt, fall back to timestamp if needed.
  let created = toIsoStringFromValue(record.createdAt);
  if (!created && record.timestamp !== undefined) {
    created = toIsoStringFromValue(record.timestamp);
    if (created) {
      record.createdAt = created;
    }
  } else if (created) {
    record.createdAt = created;
  }
  // We intentionally do not maintain an `updatedAt` field on the frontend;
  // only normalize and expose `createdAt` (from createdAt or timestamp).
  return copy;
}
// ------------------------------------------------------------------------------

/**
 * Tạo đánh giá mới
 */
export const createReview = async (
  data: ReviewRequest
): Promise<ReviewResponse> => {
  const response = await api.post<ApiResponse<ReviewResponse>>(
    "/reviews",
    data
  );
  return normalizeReviewDates(response.data.result);
};

/**
 * Lấy thông tin một đánh giá
 */
export const getReview = async (reviewId: string): Promise<ReviewResponse> => {
  const response = await api.get<ApiResponse<ReviewResponse>>(
    `/reviews/${reviewId}`
  );
  return normalizeReviewDates(response.data.result);
};

/**
 * Lấy tất cả đánh giá của một tour
 */
export const getReviewsByTour = async (
  tourId: string
): Promise<ReviewResponse[]> => {
  const response = await api.get<ApiResponse<ReviewResponse[]>>(
    `/reviews/tour/${tourId}`
  );
  return response.data.result.map((r) => normalizeReviewDates(r));
};

/**
 * Lấy tất cả đánh giá của user hiện tại
 */
export const getMyReviews = async (): Promise<ReviewResponse[]> => {
  const response = await api.get<ApiResponse<ReviewResponse[]>>(
    "/reviews/my-reviews"
  );
  return response.data.result.map((r) => normalizeReviewDates(r));
};

/**
 * Cập nhật đánh giá
 */
export const updateReview = async (
  reviewId: string,
  data: ReviewRequest
): Promise<ReviewResponse> => {
  const response = await api.put<ApiResponse<ReviewResponse>>(
    `/reviews/${reviewId}`,
    data
  );
  return normalizeReviewDates(response.data.result);
};

/**
 * Xóa đánh giá
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/reviews/${reviewId}`);
};
