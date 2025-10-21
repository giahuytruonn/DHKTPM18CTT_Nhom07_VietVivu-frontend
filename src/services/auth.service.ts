// src/services/auth.service.ts
import api from "./api";
import type {
  AuthenticationRequest,
  AuthenticationResponse,
  LogoutRequest,
} from "../types/user";
import type { ApiResponse } from "../types/apiresponse";
export const login = async (data: AuthenticationRequest) => {
  const res = await api.post<ApiResponse<AuthenticationResponse>>(
    "/auth/token",
    data
  );
  return res.data.result;
};

// login với Google — backend yêu cầu gửi code query param
export const loginWithGoogle = async (code: string) => {
  const res = await api.post<ApiResponse<AuthenticationResponse>>(
    `http://localhost:8080/vietvivu/auth/outbound/authentication?code=${code}`
  );
  return res.data.result;
};

export const refreshToken = async () => {
  const res = await api.post<ApiResponse<AuthenticationResponse>>(
    "/auth/refresh",
    {}
  );
  return res.data.result;
};

export const logout = async (token: string) => {
  const res = await api.post<ApiResponse<null>>("/auth/logout", { token });
  return res.data;
};


