import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

export interface PromotionInfo {
  promotionId: string;
  description: string | null;
  discount: number;
  startDate: string | null;
  endDate: string | null;
  status: boolean;
  quantity: number;
}

export const getPromotionById = async (
  promotionId: string
): Promise<PromotionInfo> => {
  const response = await api.get<ApiResponse<PromotionInfo>>(
    `/promotions/${promotionId}`
  );
  return response.data.result;
};

