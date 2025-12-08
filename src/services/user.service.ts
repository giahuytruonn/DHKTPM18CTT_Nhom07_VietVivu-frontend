import api from "./api";
import type { ApiResponse } from "../types/apiresponse";
import type {
  PasswordCreationRequest,
  UserResponse,
  UserUpdateRequest,
  UserCreationRequest,
  ForgotPasswordRequest,
} from "../types/user";

// Get current user profile
export const getUserProfile = async (): Promise<UserResponse> => {
  const res = await api.get<ApiResponse<UserResponse>>("/users/my-info");
  return res.data.result;
};

// Update current user profile
export const updateUserProfile = async (
  data: UserUpdateRequest
): Promise<UserResponse> => {
  const res = await api.put<ApiResponse<UserResponse>>("/users/my-info", data);
  return res.data.result;
};

// Create password (for Google login users)
export const createPassword = async (
  req: PasswordCreationRequest
): Promise<void> => {
  await api.post<ApiResponse<null>>("/users/create-password", req);
};

// ============ ADMIN ONLY ============

// Pagination Response Type
interface PaginationResponse<T> {
  items: T[];
  currentPage: number;
  pageSizes: number;
  totalItems: number;
  totalPages: number;
}

// Get all users (Admin) - Fetch ALL users across all pages
export const getAllUsers = async (): Promise<UserResponse[]> => {
  // First, get the first page to know total pages
  const firstPage = await api.get<
    ApiResponse<PaginationResponse<UserResponse>>
  >("/users", {
    params: { page: 0, size: 100 },
  });

  const { items, totalPages } = firstPage.data.result;

  // If only 1 page, return immediately
  if (totalPages <= 1) {
    return items;
  }

  // Fetch remaining pages in parallel
  const remainingPagesPromises = [];
  for (let page = 1; page < totalPages; page++) {
    remainingPagesPromises.push(
      api.get<ApiResponse<PaginationResponse<UserResponse>>>("/users", {
        params: { page, size: 100 },
      })
    );
  }

  const remainingPages = await Promise.all(remainingPagesPromises);

  // Combine all users from all pages
  const allUsers = [
    ...items,
    ...remainingPages.flatMap((res) => res.data.result.items),
  ];

  return allUsers;
};

// Search users (Admin)
export const searchUsers = async (keyword: string): Promise<UserResponse[]> => {
  const res = await api.get<ApiResponse<UserResponse[]>>("/users/search", {
    params: { keyword },
  });
  return res.data.result;
};

// Get user by ID (Admin)
export const getUserById = async (userId: string): Promise<UserResponse> => {
  const res = await api.get<ApiResponse<UserResponse>>(`/users/${userId}`);
  return res.data.result;
};

// Create user (Admin)
export const createUser = async (
  data: UserCreationRequest
): Promise<UserResponse> => {
  const res = await api.post<ApiResponse<UserResponse>>("/users", data);
  return res.data.result;
};

// Update user (Admin)
export const updateUser = async (
  userId: string,
  data: UserUpdateRequest
): Promise<UserResponse> => {
  const res = await api.put<ApiResponse<UserResponse>>(
    `/users/${userId}`,
    data
  );
  return res.data.result;
};

// Update user status (Admin)
export const updateUserStatus = async (
  userId: string,
  isActive: boolean
): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/users/${userId}/status`, null, {
    params: { isActive },
  });
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("users/forgot-password", data);
};
