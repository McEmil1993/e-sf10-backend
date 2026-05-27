import type { RowDataPacket } from "mysql2";

export interface SchoolBaseFields {
  depedSchoolId: string;
  schoolName: string;
  district: string;
  division: string;
  region: string;
  address: string;
  schoolLogo: string | null;
  depedLogo: string | null;
  otherLogo: string | null;
}

export interface SchoolRecord extends SchoolBaseFields {
  schoolId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface UpdateSchoolInput extends SchoolBaseFields {}

export interface UpdateSchoolDto {
  depedSchoolId?: string;
  schoolName?: string;
  district?: string;
  division?: string;
  region?: string;
  address?: string;
  schoolLogo?: string | null;
  depedLogo?: string | null;
  otherLogo?: string | null;
}

export interface SchoolResponseDto extends SchoolBaseFields {
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SchoolRow extends RowDataPacket {
  schoolId: number;
  depedSchoolId: string;
  schoolName: string;
  district: string;
  division: string;
  region: string;
  address: string;
  schoolLogo: string | null;
  depedLogo: string | null;
  otherLogo: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
