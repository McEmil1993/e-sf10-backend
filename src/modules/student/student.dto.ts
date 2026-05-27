import { HttpError } from "../../common/utils/http-error";
import {
  parseCreateGuardianDto,
  parseGuardianIdParam,
  toGuardianResponseDto,
} from "../guardian/guardian.dto";
import type {
  CreateStudentGuardianDto,
  CreateStudentDto,
  StudentGuardianRecord,
  StudentGuardianResponseDto,
  StudentInformationLookupRecord,
  StudentInformationLookupsResponseDto,
  StudentInformationRecord,
  StudentRecord,
  StudentResponseDto,
  UpdateStudentGuardianDto,
  UpdateStudentInformationDto,
  UpdateStudentDto,
} from "./student.interface";

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

const getNormalizedLrn = (value: unknown, fieldName: string): string => {
  const lrn = getOptionalRequiredString(value, fieldName).replace(/\s+/g, "");

  if (!/^\d{1,20}$/.test(lrn)) {
    throw new HttpError(400, `${fieldName} must contain digits only and be at most 20 characters.`);
  }

  return lrn;
};

const getNormalizedSex = (value: unknown, fieldName: string): "male" | "female" => {
  const sex = getOptionalRequiredString(value, fieldName).toLowerCase();

  if (sex !== "male" && sex !== "female") {
    throw new HttpError(400, `${fieldName} must be either male or female.`);
  }

  return sex;
};

const getNormalizedStatus = (
  value: unknown,
  fieldName: string,
): "active" | "inactive" | "transferred" | "graduated" => {
  const status = getOptionalRequiredString(value, fieldName).toLowerCase();

  if (
    status !== "active" &&
    status !== "inactive" &&
    status !== "transferred" &&
    status !== "graduated"
  ) {
    throw new HttpError(400, `${fieldName} must be active, inactive, transferred, or graduated.`);
  }

  return status;
};

const getBirthdate = (value: unknown, fieldName: string): string => {
  const birthdate = getOptionalRequiredString(value, fieldName);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    throw new HttpError(400, `${fieldName} must be in YYYY-MM-DD format.`);
  }

  const parsedDate = new Date(`${birthdate}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new HttpError(400, `${fieldName} must be a valid date.`);
  }

  return birthdate;
};

const getBooleanValue = (value: unknown, fieldName: string): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["1", "true", "yes"].includes(normalizedValue)) {
      return true;
    }

    if (["0", "false", "no"].includes(normalizedValue)) {
      return false;
    }
  }

  throw new HttpError(400, `${fieldName} must be a boolean value.`);
};

const getOptionalPositiveInteger = (value: unknown, fieldName: string): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

export const parseStudentIdParam = (
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

export const parseCreateStudentDto = (payload: unknown): CreateStudentDto => {
  const body = getBodyObject(payload);

  return {
    lrn: getNormalizedLrn(body.lrn, "lrn"),
    firstName: getRequiredString(body.firstName, "firstName"),
    middleName: getOptionalNullableString(body.middleName, "middleName"),
    lastName: getRequiredString(body.lastName, "lastName"),
    suffix: getOptionalNullableString(body.suffix, "suffix"),
    sex: getNormalizedSex(body.sex, "sex"),
    birthdate: getBirthdate(body.birthdate, "birthdate"),
    birthplace: getOptionalNullableString(body.birthplace, "birthplace"),
    streetAddress: getOptionalNullableString(body.streetAddress, "streetAddress"),
    barangay: getRequiredString(body.barangay, "barangay"),
    cityMunicipality: getRequiredString(body.cityMunicipality, "cityMunicipality"),
    province: getRequiredString(body.province, "province"),
    region: getRequiredString(body.region, "region"),
    status: body.status === undefined ? "active" : getNormalizedStatus(body.status, "status"),
    profilePicture: getOptionalNullableString(body.profilePicture, "profilePicture"),
  };
};

export const parseUpdateStudentDto = (payload: unknown): UpdateStudentDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateStudentDto = {};

  if ("lrn" in body) {
    updatePayload.lrn = getNormalizedLrn(body.lrn, "lrn");
  }

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

  if ("sex" in body) {
    updatePayload.sex = getNormalizedSex(body.sex, "sex");
  }

  if ("birthdate" in body) {
    updatePayload.birthdate = getBirthdate(body.birthdate, "birthdate");
  }

  if ("birthplace" in body) {
    updatePayload.birthplace = getOptionalNullableString(body.birthplace, "birthplace");
  }

  if ("streetAddress" in body) {
    updatePayload.streetAddress = getOptionalNullableString(body.streetAddress, "streetAddress");
  }

  if ("barangay" in body) {
    updatePayload.barangay = getOptionalRequiredString(body.barangay, "barangay");
  }

  if ("cityMunicipality" in body) {
    updatePayload.cityMunicipality = getOptionalRequiredString(body.cityMunicipality, "cityMunicipality");
  }

  if ("province" in body) {
    updatePayload.province = getOptionalRequiredString(body.province, "province");
  }

  if ("region" in body) {
    updatePayload.region = getOptionalRequiredString(body.region, "region");
  }

  if ("status" in body) {
    updatePayload.status = getNormalizedStatus(body.status, "status");
  }

  if ("profilePicture" in body) {
    updatePayload.profilePicture = getOptionalNullableString(body.profilePicture, "profilePicture");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const parseUpdateStudentInformationDto = (payload: unknown): UpdateStudentInformationDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateStudentInformationDto = {};

  if ("motherTongueId" in body) {
    updatePayload.motherTongueId = getOptionalPositiveInteger(body.motherTongueId, "motherTongueId");
  }

  if ("motherTongue" in body) {
    updatePayload.motherTongue = getOptionalNullableString(body.motherTongue, "motherTongue");
  }

  if ("indigenousGroupId" in body) {
    updatePayload.indigenousGroupId = getOptionalPositiveInteger(body.indigenousGroupId, "indigenousGroupId");
  }

  if ("indigenousGroup" in body) {
    updatePayload.indigenousGroup = getOptionalNullableString(body.indigenousGroup, "indigenousGroup");
  }

  if ("indigenousGroupOther" in body) {
    updatePayload.indigenousGroupOther = getOptionalNullableString(body.indigenousGroupOther, "indigenousGroupOther");
  }

  if ("religionId" in body) {
    updatePayload.religionId = getOptionalPositiveInteger(body.religionId, "religionId");
  }

  if ("religion" in body) {
    updatePayload.religion = getOptionalNullableString(body.religion, "religion");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const parseCreateStudentGuardianDto = (payload: unknown): CreateStudentGuardianDto => {
  const body = getBodyObject(payload);
  const relationship = getOptionalRequiredString(body.relationship, "relationship");
  const isPrimary = "isPrimary" in body ? getBooleanValue(body.isPrimary, "isPrimary") : false;

  if ("guardianId" in body && body.guardianId !== undefined && body.guardianId !== null && body.guardianId !== "") {
    return {
      guardianId: parseGuardianIdParam(body.guardianId as string | string[] | undefined, "guardianId"),
      relationship,
      isPrimary,
    };
  }

  const guardianPayload = parseCreateGuardianDto(body);

  return {
    ...guardianPayload,
    guardianId: null,
    relationship,
    isPrimary,
  };
};

export const parseUpdateStudentGuardianDto = (payload: unknown): UpdateStudentGuardianDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateStudentGuardianDto = {};

  if ("relationship" in body) {
    updatePayload.relationship = getOptionalRequiredString(body.relationship, "relationship");
  }

  if ("isPrimary" in body) {
    updatePayload.isPrimary = getBooleanValue(body.isPrimary, "isPrimary");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toStudentResponseDto = (student: StudentRecord): StudentResponseDto => ({
  id: student.id,
  lrn: student.lrn,
  firstName: student.firstName,
  middleName: student.middleName,
  lastName: student.lastName,
  suffix: student.suffix,
  sex: student.sex,
  birthdate: student.birthdate,
  birthplace: student.birthplace,
  streetAddress: student.streetAddress,
  barangay: student.barangay,
  cityMunicipality: student.cityMunicipality,
  province: student.province,
  region: student.region,
  status: student.status,
  profilePicture: student.profilePicture,
  createdAt: toIsoString(student.createdAt),
  updatedAt: toIsoString(student.updatedAt),
  deletedAt: toNullableIsoString(student.deletedAt),
});

export const toStudentGuardianResponseDto = (
  studentGuardian: StudentGuardianRecord,
): StudentGuardianResponseDto => ({
  id: studentGuardian.id,
  studentId: studentGuardian.studentId,
  guardianId: studentGuardian.guardianId,
  relationship: studentGuardian.relationship,
  isPrimary: studentGuardian.isPrimary,
  guardian: toGuardianResponseDto(studentGuardian.guardian),
  createdAt: toIsoString(studentGuardian.createdAt),
  updatedAt: toIsoString(studentGuardian.updatedAt),
  deletedAt: toNullableIsoString(studentGuardian.deletedAt),
});

export const toStudentInformationLookupResponseDto = (
  lookup: StudentInformationLookupRecord,
): StudentInformationLookupRecord => ({
  id: lookup.id,
  name: lookup.name,
  sortOrder: lookup.sortOrder,
  isActive: lookup.isActive,
});

export const toStudentInformationLookupsResponseDto = (
  lookups: StudentInformationLookupsResponseDto,
): StudentInformationLookupsResponseDto => ({
  motherTongues: lookups.motherTongues.map(toStudentInformationLookupResponseDto),
  indigenousGroups: lookups.indigenousGroups.map(toStudentInformationLookupResponseDto),
  religions: lookups.religions.map(toStudentInformationLookupResponseDto),
});

export const toStudentInformationResponseDto = (
  information: StudentInformationRecord,
): StudentInformationRecord => ({
  studentId: information.studentId,
  motherTongue: information.motherTongue
    ? toStudentInformationLookupResponseDto(information.motherTongue)
    : null,
  indigenousGroup: information.indigenousGroup
    ? toStudentInformationLookupResponseDto(information.indigenousGroup)
    : null,
  religion: information.religion ? toStudentInformationLookupResponseDto(information.religion) : null,
});
