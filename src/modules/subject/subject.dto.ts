import { HttpError } from "../../common/utils/http-error";
import type {
  CreateSubjectDto,
  SubjectRecord,
  SubjectResponseDto,
  UpdateSubjectDto,
} from "./subject.interface";

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

const getOptionalNullableString = (value: unknown, fieldName: string): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string.`);
  }

  return value.trim() || null;
};

const getBoolean = (value: unknown, fieldName: string, fallback: boolean): boolean => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  throw new HttpError(400, `${fieldName} must be a boolean.`);
};

const getInteger = (value: unknown, fieldName: string, fallback: number): number => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    throw new HttpError(400, `${fieldName} must be a non-negative integer.`);
  }

  return parsedValue;
};

const getGradeLevels = (value: unknown): number[] => {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const gradeLevels = Array.from(
    new Set(
      rawValues
        .map((item) => Number(String(item).trim()))
        .filter((item) => Number.isInteger(item) && item >= 1 && item <= 6),
    ),
  ).sort((firstValue, secondValue) => firstValue - secondValue);

  if (gradeLevels.length === 0) {
    throw new HttpError(400, "gradeLevels must include at least one grade from 1 to 6.");
  }

  return gradeLevels;
};

export const parseSubjectIdParam = (
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

export const parseCreateSubjectDto = (payload: unknown): CreateSubjectDto => {
  const body = getBodyObject(payload);

  return {
    name: getRequiredString(body.name, "name"),
    subjectGroup: getOptionalNullableString(body.subjectGroup, "subjectGroup"),
    gradeLevels: getGradeLevels(body.gradeLevels),
    isOptional: getBoolean(body.isOptional, "isOptional", false),
    sortOrder: getInteger(body.sortOrder, "sortOrder", 0),
    isActive: getBoolean(body.isActive, "isActive", true),
  };
};

export const parseUpdateSubjectDto = (payload: unknown): UpdateSubjectDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateSubjectDto = {};

  if ("name" in body) {
    updatePayload.name = getOptionalRequiredString(body.name, "name");
  }

  if ("subjectGroup" in body) {
    updatePayload.subjectGroup = getOptionalNullableString(body.subjectGroup, "subjectGroup");
  }

  if ("gradeLevels" in body) {
    updatePayload.gradeLevels = getGradeLevels(body.gradeLevels);
  }

  if ("isOptional" in body) {
    updatePayload.isOptional = getBoolean(body.isOptional, "isOptional", false);
  }

  if ("sortOrder" in body) {
    updatePayload.sortOrder = getInteger(body.sortOrder, "sortOrder", 0);
  }

  if ("isActive" in body) {
    updatePayload.isActive = getBoolean(body.isActive, "isActive", true);
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toSubjectResponseDto = (subject: SubjectRecord): SubjectResponseDto => {
  return {
    id: subject.id,
    name: subject.name,
    subjectGroup: subject.subjectGroup,
    gradeLevels: subject.gradeLevels,
    isOptional: subject.isOptional,
    sortOrder: subject.sortOrder,
    isActive: subject.isActive,
    createdAt: toIsoString(subject.createdAt),
    updatedAt: toIsoString(subject.updatedAt),
    deletedAt: toNullableIsoString(subject.deletedAt),
  };
};
