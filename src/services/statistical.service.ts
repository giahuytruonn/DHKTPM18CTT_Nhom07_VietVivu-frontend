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

export interface MonthlyRevenue {
  month: number;
  revenue: number;
}

/* ============================================================
    HÀM TIỆN ÍCH TẠO URL QUERY
   ============================================================ */
const buildQuery = (params: Record<string, any>) => {
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
};

/* ============================================================
    1. TOP TOUR
   ============================================================ */
export const getTopBookedTours = async (
  bookingStatus: string,
  topN: number,
  startTime?: string,
  endTime?: string
): Promise<TopTour[]> => {
  const res = await api.get<ApiResponse<Record<string, number>>>(
    "/statistical/top-booked-tours",
    { params: { bookingStatus, topN, startTime, endTime } }
  );

  return Object.entries(res.data.result || {}).map(([title, count]) => ({
    name: title,
    value: Number(count),
  }));
};


/* ============================================================
    2. TOP USERS
   ============================================================ */
export const getTopUsers = async (
  bookingStatus: string,
  topN: number,
  startTime?: string,
  endTime?: string
): Promise<TopUser[]> => {
  const res = await api.get<ApiResponse<Record<string, number>>>(
    "/statistical/top-users",
    { params: { bookingStatus, topN, startTime, endTime } }
  );

  return Object.entries(res.data.result || {}).map(([name, count]) => ({
    name,
    value: Number(count),
  }));
};


/* ============================================================
    3. TỔNG BOOKING THEO TRẠNG THÁI
   ============================================================ */
export const getBookingStatusSummary = async (
  status?: string,
  startTime?: string,
  endTime?: string
): Promise<{ name: string; value: number }[]> => {
  const params: any = {};

  if (status && status !== "" && status !== "ALL") params.bookingStatus = status;
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;

  const res = await api.get<ApiResponse<Record<string, number>>>(
    "/statistical/total-bookings-by-status",
    { params }
  );

  return Object.entries(res.data.result || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));
};


/* ============================================================
    4. TỔNG DOANH THU
   ============================================================ */
export const getTotalRevenue = async (): Promise<number> => {
  const res = await api.get<ApiResponse<number>>("/statistical/total-revenue");
  return res.data.result ?? 0;
};

/* ============================================================
    5. DOANH THU THEO THÁNG
   ============================================================ */
export const getMonthlyRevenue = async (
  year: number
): Promise<MonthlyRevenue[]> => {
  
  const res = await api.get<ApiResponse<Record<string, number>>>(
    `/statistical/revenue-by-month?year=${year}`
  );

  return Object.entries(res.data.result || {}).map(([month, revenue]) => ({
    month: Number(month),
    revenue: Number(revenue),
  }));
};

export const getRevenueByPaymentMethod = async () => {
  const res = await api.get<ApiResponse<Record<string, number>>>(
    "/statistical/revenue-by-payment-method"
  );

  return Object.entries(res.data.result || {}).map(([name, value]) => ({
    name,
    value: Number(value)
  }));
};


