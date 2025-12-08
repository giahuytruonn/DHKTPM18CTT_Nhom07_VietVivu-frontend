import { parseDateSafely } from "./date";

export type CancellationPolicyRule = {
  id: "EARLY" | "MID" | "LATE";
  title: string;
  timeRange: string;
  rate: number;
  description: string;
};

export const CANCELLATION_POLICY_RULES: CancellationPolicyRule[] = [
  {
    id: "EARLY",
    title: "Hủy ngay sau khi đăng ký",
    timeRange: "Sớm hơn 15 ngày trước khởi hành",
    rate: 0.25,
    description: "Khấu trừ 25% tổng giá trị tour, số tiền còn lại sẽ được hoàn trả.",
  },
  {
    id: "MID",
    title: "Hủy trước 15 - 8 ngày",
    timeRange: "Trong khoảng 15 đến 8 ngày trước khởi hành",
    rate: 0.5,
    description: "Khấu trừ 50% tổng giá trị tour, hỗ trợ hoàn lại phần còn lại cho bạn.",
  },
  {
    id: "LATE",
    title: "Hủy sát ngày khởi hành",
    timeRange: "Ít hơn 7 ngày trước khởi hành",
    rate: 1,
    description: "Khấu trừ 100% do tour đã cận ngày khởi hành, không thể hoàn tiền.",
  },
];

export const computeDaysUntilStart = (startDate?: string | null): number | null => {
  const departureDate = parseDateSafely(startDate);
  if (!departureDate) {
    return null;
  }

  const now = new Date();
  const diffMs = departureDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const determineCancellationPolicy = (
  daysUntilStart: number | null
): CancellationPolicyRule => {
  if (daysUntilStart === null || Number.isNaN(daysUntilStart)) {
    return CANCELLATION_POLICY_RULES[0];
  }

  if (daysUntilStart > 15) {
    return CANCELLATION_POLICY_RULES[0];
  }

  if (daysUntilStart >= 8) {
    return CANCELLATION_POLICY_RULES[1];
  }

  return CANCELLATION_POLICY_RULES[2];
};

