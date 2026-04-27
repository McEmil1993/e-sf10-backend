import type { RowDataPacket } from "mysql2";

export interface UserBaseFields {
  name: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  sex: string | null;
  email: string;
  contactNumber: string | null;
  address: string | null;
  barangay: string | null;
  municipalityCity: string | null;
  province: string | null;
  region: string | null;
  username: string | null;
  roles: string[];
  position: string | null;
  status: string;
  profilePicture: string | null;
}

export interface UserRecord extends UserBaseFields {
  id: number;
  passwordHash: string;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserInput extends UserBaseFields {
  passwordHash: string;
}

export interface UpdateUserInput extends UserBaseFields {
  passwordHash: string;
}

export interface CreateUserDto extends UserBaseFields {
  password: string;
}

export interface UpdateUserDto {
  name?: string | null;
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  suffix?: string | null;
  sex?: string | null;
  email?: string;
  contactNumber?: string | null;
  address?: string | null;
  barangay?: string | null;
  municipalityCity?: string | null;
  province?: string | null;
  region?: string | null;
  username?: string | null;
  password?: string;
  roles?: string[];
  position?: string | null;
  status?: string;
  profilePicture?: string | null;
}

export interface ChangeCurrentPasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponseDto extends UserBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserRow extends RowDataPacket {
  id: number;
  name: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  sex: string | null;
  email: string;
  contactNumber: string | null;
  address: string | null;
  barangay: string | null;
  municipalityCity: string | null;
  province: string | null;
  region: string | null;
  username: string | null;
  passwordHash: string;
  roles: string | string[] | null;
  position: string | null;
  status: string;
  profilePicture: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
