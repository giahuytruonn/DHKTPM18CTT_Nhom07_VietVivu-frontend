import api from "./api";
import type { TourResponse } from "../types/tour";

interface SearchParams {
    keyword?: string;
    destination?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const searchTours = async (params: SearchParams = {}): Promise<TourResponse[]> => {
    const { data } = await api.get("/tours/search", { params });
    return data.result ?? [];
};