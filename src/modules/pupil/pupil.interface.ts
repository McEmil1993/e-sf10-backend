import type { RowDataPacket } from "mysql2";

export interface PupilBaseFields {
  lrn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  sex: "male" | "female";
  birthdate: string;
  birthplace: string | null;
  streetAddress: string | null;
  barangay: string;
  cityMunicipality: string;
  province: string;
  region: string;
  status: "active" | "inactive" | "transferred" | "graduated";
}

export interface PupilRecord extends PupilBaseFields {
  id: number;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePupilInput extends PupilBaseFields {}

export interface UpdatePupilInput extends PupilBaseFields {}

export interface CreatePupilDto extends PupilBaseFields {}

export interface UpdatePupilDto {
  lrn?: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  sex?: "male" | "female";
  birthdate?: string;
  birthplace?: string | null;
  streetAddress?: string | null;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
  region?: string;
  status?: "active" | "inactive" | "transferred" | "graduated";
}

export interface PupilResponseDto extends PupilBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PupilRow extends RowDataPacket {
  id: number;
  lrn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  sex: "male" | "female";
  birthdate: Date | string;
  birthplace: string | null;
  streetAddress: string | null;
  barangay: string;
  cityMunicipality: string;
  province: string;
  region: string;
  status: "active" | "inactive" | "transferred" | "graduated";
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
