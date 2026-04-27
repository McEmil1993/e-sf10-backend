import type { RowDataPacket } from "mysql2";

export interface PositionBaseFields {
  acronym: string;
  fullPosition: string;
  category: string;
}

export interface PositionRecord extends PositionBaseFields {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface CreatePositionInput extends PositionBaseFields {}

export interface UpdatePositionInput extends PositionBaseFields {}

export interface CreatePositionDto extends PositionBaseFields {}

export interface UpdatePositionDto {
  acronym?: string;
  fullPosition?: string;
  category?: string;
}

export interface PositionResponseDto extends PositionBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PositionRow extends RowDataPacket {
  id: number;
  acronym: string;
  fullPosition: string;
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
