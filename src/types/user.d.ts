import type { RoleResponseDto } from "./role";

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  noPassword: boolean;
  isActive: boolean;
  roles: RoleResponseDto[];
}

export interface UserCreationRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  address?: string;
  phoneNumber: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
}

export interface PasswordCreationRequest {
  password: string;
}

export interface LogoutRequest {
  token: string;
}

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetToken: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
}
