import type { PermissionResponseDto } from "./permission";

export interface RoleResponseDto {
  name: string;
  description: string;
  permissions: PermissionResponseDto[];
}

export interface RoleRequestDto {
  name: string;
  description: string;
  permissions: string[];
}
