// src/services/statistical.service.ts
import api from "./api";
import type { ApiResponse } from "../types/apiresponse";

export interface TopTour {
  name: string;
  value: number;
}

export interface TopUser {
  name: string;
  value: number;
}

// Lấy top tour theo trạng thái
export const getTopBookedTours = async (bookingStatus: string): Promise<TopTour[]> => {
  const res = await api.get<ApiResponse<Record<string, number>>>(`/statistical/top-booked-tours?bookingStatus=${bookingStatus}`);
  return Object.entries(res.data.result || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));  
};

// Lấy top khách hàng theo trạng thái
export const getTopUsers = async (bookingStatus: string): Promise<TopUser[]> => {
  const res = await api.get<ApiResponse<Record<string, number>>>(`/statistical/top-users?bookingStatus=${bookingStatus}`);
  return Object.entries(res.data.result || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));
};

// Tổng số booking theo trạng thái
export const getBookingStatusSummary = async (): Promise<{name: string; value: number}[]> => {
  const res = await api.get<ApiResponse<Record<string, number>>>("/statistical/total-bookings-by-status");
  return Object.entries(res.data.result || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));
};

// Tổng doanh thu
export const getTotalRevenue = async (): Promise<number> => {
  const res = await api.get<ApiResponse<number>>("/statistical/total-revenue");
  return res.data.result ?? 0;
};


