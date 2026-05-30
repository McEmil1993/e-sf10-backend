import { HttpError } from "../../common/utils/http-error";
import type {
  AcademicEntityDefinition,
  AcademicEntityKey,
  AcademicFieldDefinition,
} from "./academic.interface";
import { academicEntityDefinitions } from "./academic.definitions";

export const parseAcademicEntityKey = (value: string | string[] | undefined): AcademicEntityKey => {
  if (Array.isArray(value) || !value || !(value in academicEntityDefinitions)) {
    throw new HttpError(404, "Academic module not found.");
  }

  return value as AcademicEntityKey;
};

export const parseAcademicIdParam = (value: string | string[] | undefined, fieldName = "id"): number => {
  if (Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

const getBodyObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "Request body must be a valid JSON object.");
  }

  return payload as Record<string, unknown>;
};

const parseFieldValue = (field: AcademicFieldDefinition, value: unknown, isCreate: boolean) => {
  const hasValue = value !== undefined && value !== null && value !== "";

  if (!hasValue) {
    if (field.required && isCreate) {
      throw new HttpError(400, `${field.requestKey} is required.`);
    }

    return field.defaultValue ?? null;
  }

  if (field.type === "string") {
    if (typeof value !== "string") {
      throw new HttpError(400, `${field.requestKey} must be a string.`);
    }

    const trimmedValue = value.trim();

    if (!trimmedValue && field.required) {
      throw new HttpError(400, `${field.requestKey} is required.`);
    }

    return trimmedValue || null;
  }

  if (field.type === "number") {
    const parsedValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

    if (!Number.isFinite(parsedValue)) {
      throw new HttpError(400, `${field.requestKey} must be a number.`);
    }

    return parsedValue;
  }

  if (field.type === "boolean") {
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }

    if (typeof value === "string" && (value === "true" || value === "false")) {
      return value === "true" ? 1 : 0;
    }

    throw new HttpError(400, `${field.requestKey} must be a boolean.`);
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${field.requestKey} must be a date string.`);
  }

  const trimmedValue = value.trim();
  const dateValue = new Date(trimmedValue);

  if (!trimmedValue || Number.isNaN(dateValue.getTime())) {
    throw new HttpError(400, `${field.requestKey} must be a valid date.`);
  }

  return trimmedValue;
};

export const parseCreateAcademicDto = (
  definition: AcademicEntityDefinition,
  payload: unknown,
): Record<string, unknown> => {
  const body = getBodyObject(payload);
  const result: Record<string, unknown> = {};

  for (const field of definition.fields) {
    result[field.requestKey] = parseFieldValue(field, body[field.requestKey], true);
  }

  return result;
};

export const parseUpdateAcademicDto = (
  definition: AcademicEntityDefinition,
  payload: unknown,
): Record<string, unknown> => {
  const body = getBodyObject(payload);
  const result: Record<string, unknown> = {};

  for (const field of definition.fields) {
    if (field.requestKey in body) {
      result[field.requestKey] = parseFieldValue(field, body[field.requestKey], false);
    }
  }

  if (Object.keys(result).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return result;
};
