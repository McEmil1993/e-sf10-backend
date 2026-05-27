import { HttpError } from "../../common/utils/http-error";
import type {
  CreateGuardianDto,
  GuardianRecord,
  GuardianResponseDto,
  UpdateGuardianDto,
} from "./guardian.interface";

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

  return value.trim();
};

const getContactNumber = (value: unknown, fieldName: string): string => {
  const contactNumber = getOptionalRequiredString(value, fieldName).replace(/\D/g, "");

  if (!/^\d{7,20}$/.test(contactNumber)) {
    throw new HttpError(400, `${fieldName} must contain 7 to 20 digits.`);
  }

  return contactNumber;
};

export const parseGuardianIdParam = (
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

export const parseCreateGuardianDto = (payload: unknown): CreateGuardianDto => {
  const body = getBodyObject(payload);

  return {
    firstName: getRequiredString(body.firstName, "firstName"),
    middleName: getOptionalNullableString(body.middleName, "middleName"),
    lastName: getRequiredString(body.lastName, "lastName"),
    suffix: getOptionalNullableString(body.suffix, "suffix"),
    relationship: getRequiredString(body.relationship, "relationship"),
    contactNumber: getContactNumber(body.contactNumber, "contactNumber"),
    address: getRequiredString(body.address, "address"),
    barangay: getRequiredString(body.barangay, "barangay"),
    municipalityCity: getRequiredString(body.municipalityCity, "municipalityCity"),
    province: getRequiredString(body.province, "province"),
    region: getRequiredString(body.region, "region"),
    profilePicture: getOptionalNullableString(body.profilePicture, "profilePicture"),
  };
};

export const parseUpdateGuardianDto = (payload: unknown): UpdateGuardianDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateGuardianDto = {};

  if ("firstName" in body) {
    updatePayload.firstName = getOptionalRequiredString(body.firstName, "firstName");
  }

  if ("middleName" in body) {
    updatePayload.middleName = getOptionalNullableString(body.middleName, "middleName");
  }

  if ("lastName" in body) {
    updatePayload.lastName = getOptionalRequiredString(body.lastName, "lastName");
  }

  if ("suffix" in body) {
    updatePayload.suffix = getOptionalNullableString(body.suffix, "suffix");
  }

  if ("relationship" in body) {
    updatePayload.relationship = getOptionalRequiredString(body.relationship, "relationship");
  }

  if ("contactNumber" in body) {
    updatePayload.contactNumber = getContactNumber(body.contactNumber, "contactNumber");
  }

  if ("address" in body) {
    updatePayload.address = getOptionalRequiredString(body.address, "address");
  }

  if ("barangay" in body) {
    updatePayload.barangay = getOptionalRequiredString(body.barangay, "barangay");
  }

  if ("municipalityCity" in body) {
    updatePayload.municipalityCity = getOptionalRequiredString(body.municipalityCity, "municipalityCity");
  }

  if ("province" in body) {
    updatePayload.province = getOptionalRequiredString(body.province, "province");
  }

  if ("region" in body) {
    updatePayload.region = getOptionalRequiredString(body.region, "region");
  }

  if ("profilePicture" in body) {
    updatePayload.profilePicture = getOptionalNullableString(body.profilePicture, "profilePicture");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toGuardianResponseDto = (guardian: GuardianRecord): GuardianResponseDto => ({
  id: guardian.id,
  firstName: guardian.firstName,
  middleName: guardian.middleName,
  lastName: guardian.lastName,
  suffix: guardian.suffix,
  relationship: guardian.relationship,
  contactNumber: guardian.contactNumber,
  address: guardian.address,
  barangay: guardian.barangay,
  municipalityCity: guardian.municipalityCity,
  province: guardian.province,
  region: guardian.region,
  profilePicture: guardian.profilePicture,
  createdAt: toIsoString(guardian.createdAt),
  updatedAt: toIsoString(guardian.updatedAt),
  deletedAt: toNullableIsoString(guardian.deletedAt),
});
