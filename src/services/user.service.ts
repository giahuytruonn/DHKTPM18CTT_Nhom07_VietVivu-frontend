import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type { 
  PasswordCreationRequest, 
  UserResponse, 
  UserUpdateRequest,
  UserCreationRequest
} from "../types/user";

// Get current user profile
export const getUserProfile = async (): Promise<UserResponse> => {
  const res = await api.get<ApiResponse<UserResponse>>("/users/my-info");
  return res.data.result;
};

// Update current user profile
export const updateUserProfile = async (data: UserUpdateRequest): Promise<UserResponse> => {
  const res = await api.put<ApiResponse<UserResponse>>("/users/my-info", data);
  return res.data.result;
};

// Create password (for Google login users)
export const createPassword = async (req: PasswordCreationRequest): Promise<void> => {
  await api.post<ApiResponse<null>>("/users/create-password", req);
};

// ============ ADMIN ONLY ============

// Get all users (Admin)
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const res = await api.get<ApiResponse<UserResponse[]>>("/users");
  return res.data.result;
};

// Search users (Admin)
export const searchUsers = async (keyword: string): Promise<UserResponse[]> => {
  const res = await api.get<ApiResponse<UserResponse[]>>("/users/search", {
    params: { keyword }
  });
  return res.data.result;
};

// Get user by ID (Admin)
export const getUserById = async (userId: string): Promise<UserResponse> => {
  const res = await api.get<ApiResponse<UserResponse>>(`/users/${userId}`);
  return res.data.result;
};

// Create user (Admin)
export const createUser = async (data: UserCreationRequest): Promise<UserResponse> => {
  const res = await api.post<ApiResponse<UserResponse>>("/users", data);
  return res.data.result;
};

// Update user (Admin)
export const updateUser = async (
  userId: string, 
  data: UserUpdateRequest
): Promise<UserResponse> => {
  const res = await api.put<ApiResponse<UserResponse>>(`/users/${userId}`, data);
  return res.data.result;
};

// Update user status (Admin)
export const updateUserStatus = async (
  userId: string, 
  isActive: boolean
): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/users/${userId}/status`, null, {
    params: { isActive }
  });
};