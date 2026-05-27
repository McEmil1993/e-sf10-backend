import { HttpError } from "../../common/utils/http-error";
import type { SchoolRecord, SchoolResponseDto, UpdateSchoolDto } from "./system.interface";

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
    throw new HttpError(400, `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
};

const getOptionalLogoPath = (value: unknown, fieldName: string): string | null => {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string or null.`);
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const parseUpdateSchoolDto = (payload: unknown): UpdateSchoolDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateSchoolDto = {};

  if ("depedSchoolId" in body) {
    updatePayload.depedSchoolId = getRequiredString(body.depedSchoolId, "depedSchoolId");
  }

  if ("schoolName" in body) {
    updatePayload.schoolName = getRequiredString(body.schoolName, "schoolName");
  }

  if ("district" in body) {
    updatePayload.district = getRequiredString(body.district, "district");
  }

  if ("division" in body) {
    updatePayload.division = getRequiredString(body.division, "division");
  }

  if ("region" in body) {
    updatePayload.region = getRequiredString(body.region, "region");
  }

  if ("address" in body) {
    updatePayload.address = getRequiredString(body.address, "address");
  }

  if ("schoolLogo" in body) {
    updatePayload.schoolLogo = getOptionalLogoPath(body.schoolLogo, "schoolLogo");
  }

  if ("depedLogo" in body) {
    updatePayload.depedLogo = getOptionalLogoPath(body.depedLogo, "depedLogo");
  }

  if ("otherLogo" in body) {
    updatePayload.otherLogo = getOptionalLogoPath(body.otherLogo, "otherLogo");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toSchoolResponseDto = (school: SchoolRecord): SchoolResponseDto => {
  return {
    schoolId: school.schoolId,
    depedSchoolId: school.depedSchoolId,
    schoolName: school.schoolName,
    district: school.district,
    division: school.division,
    region: school.region,
    address: school.address,
    schoolLogo: school.schoolLogo,
    depedLogo: school.depedLogo,
    otherLogo: school.otherLogo,
    createdAt: toIsoString(school.createdAt),
    updatedAt: toIsoString(school.updatedAt),
    deletedAt: toNullableIsoString(school.deletedAt),
  };
};
