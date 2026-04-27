import type { RowDataPacket } from "mysql2";

export interface GuardianBaseFields {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  contactNumber: string;
  address: string;
  barangay: string;
  municipalityCity: string;
  province: string;
  region: string;
  profilePicture: string | null;
}

export interface GuardianRecord extends GuardianBaseFields {
  id: number;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateGuardianInput extends GuardianBaseFields {}

export interface UpdateGuardianInput extends GuardianBaseFields {}

export interface CreateGuardianDto extends GuardianBaseFields {}

export interface UpdateGuardianDto {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  contactNumber?: string;
  address?: string;
  barangay?: string;
  municipalityCity?: string;
  province?: string;
  region?: string;
  profilePicture?: string | null;
}

export interface GuardianResponseDto extends GuardianBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GuardianRow extends RowDataPacket {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  contactNumber: string;
  address: string;
  barangay: string;
  municipalityCity: string;
  province: string;
  region: string;
  profilePicture: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
