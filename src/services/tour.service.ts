
import api from "./api"; 
import type { ApiResponse } from "../types/apiresponse";
import type { TourResponse, TourStatus } from "../types/tour";



export const getTours = async (): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours");
  return res.data.result; 
};

interface TourSearchParams {
  keyword?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  durationDays?: number;
  minQuantity?: number;
  tourStatus?: TourStatus;
}

export const searchTours = async (params: TourSearchParams): Promise<TourResponse[]> => {
  const res = await api.get<ApiResponse<TourResponse[]>>("/tours/search", {
    params: params,
  });
  return res.data.result;
};