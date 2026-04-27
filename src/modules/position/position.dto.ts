import { HttpError } from "../../common/utils/http-error";
import type {
  CreatePositionDto,
  PositionRecord,
  PositionResponseDto,
  UpdatePositionDto,
} from "./position.interface";

const toIsoString = (value: Date | string): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
};

const toNullableIsoString = (value: Date | string | null): string | null => {
  if (!value) {
    return null;
  }

  return toIsoString(value);
};

const getBodyObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "Request body must be a valid JSON object.");
  }

  return payload as Record<string, unknown>;
};

const getRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  return value.trim();
};

const getOptionalRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
};

export const parsePositionIdParam = (
  value: string | string[] | undefined,
  fieldName = "id",
): number => {
  if (Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

export const parseCreatePositionDto = (payload: unknown): CreatePositionDto => {
  const body = getBodyObject(payload);

  return {
    acronym: getRequiredString(body.acronym, "acronym"),
    fullPosition: getRequiredString(body.fullPosition, "fullPosition"),
    category: getRequiredString(body.category, "category"),
  };
};

export const parseUpdatePositionDto = (payload: unknown): UpdatePositionDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdatePositionDto = {};

  if ("acronym" in body) {
    updatePayload.acronym = getOptionalRequiredString(body.acronym, "acronym");
  }

  if ("fullPosition" in body) {
    updatePayload.fullPosition = getOptionalRequiredString(body.fullPosition, "fullPosition");
  }

  if ("category" in body) {
    updatePayload.category = getOptionalRequiredString(body.category, "category");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toPositionResponseDto = (position: PositionRecord): PositionResponseDto => {
  return {
    id: position.id,
    acronym: position.acronym,
    fullPosition: position.fullPosition,
    category: position.category,
    createdAt: toIsoString(position.createdAt),
    updatedAt: toIsoString(position.updatedAt),
    deletedAt: toNullableIsoString(position.deletedAt),
  };
};
