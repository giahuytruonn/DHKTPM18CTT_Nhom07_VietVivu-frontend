import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse, TourStatus } from "../types/tour";


export const getTours = async (): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours");
  return res.data.result; // Trả về mảng tour
};


export interface TourSearchParams {
  keyword?: string | null;
  destination?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  startDate?: string | null;
  durationDays?: number | null;
  minQuantity?: number | null;
  tourStatus?: TourStatus | null;
}


export const searchTours = async (
  params: TourSearchParams
): Promise<TourResponse[]> => {
  
 
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  );

  const res = await api.get<ApiResponse<TourResponse[]>>("/tours/search", {
    params: cleanParams, 
  });
  return res.data.result;
};