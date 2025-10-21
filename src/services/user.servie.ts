import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { PasswordCreationRequest, UserResponse } from "../types/user";

export const createPassword = async (req: PasswordCreationRequest) => {
  const res = await api.post<ApiResponse<null>>("/users/create-password", req);
  return res;
};

export const getUserProfile = async () => {
  const res = await api.get<ApiResponse<UserResponse>>("/users/my-info");
  return res.data.result;
};
