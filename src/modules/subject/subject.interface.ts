import type { RowDataPacket } from "mysql2";

export interface SubjectBaseFields {
  name: string;
  subjectGroup: string | null;
  gradeLevels: number[];
  isOptional: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface SubjectRecord extends SubjectBaseFields {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface CreateSubjectInput extends SubjectBaseFields {}

export interface UpdateSubjectInput extends SubjectBaseFields {}

export interface CreateSubjectDto extends SubjectBaseFields {}

export interface UpdateSubjectDto {
  name?: string;
  subjectGroup?: string | null;
  gradeLevels?: number[];
  isOptional?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SubjectResponseDto extends SubjectBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SubjectRow extends RowDataPacket {
  id: number;
  name: string;
  subjectGroup: string | null;
  gradeLevels: string | number[] | null;
  isOptional: number | boolean;
  sortOrder: number;
  isActive: number | boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
