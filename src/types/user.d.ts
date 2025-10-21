import type { RoleResponseDto } from "./role";

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface ExchangeTokenResponseDto {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export interface IntrospectResponseDto {
  valid: boolean;
}

export interface OutboundUserResponseDto {
  id: string;
  email: string;
  verifiedEmail: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  locale: string;
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
  role: RoleResponseDto[];
}

export interface UserCreationResquestDto {
  username: string;
  password: string;
  name: string;
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface UserUpdateRequestDto {
  name: string;
}

export interface PasswordCreationRequest {
  password: string;
}

export interface LogoutRequest {
  token: string;
}

export interface IntrosepectRequestDto {
  token: string;
}

export interface ExchangeTokenRequestDto {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType: string;
}

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface RefreshRequestDto {
  token: string;
}
