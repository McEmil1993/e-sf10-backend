import { HttpError } from "../../common/utils/http-error";
import type {
  CreatePupilDto,
  PupilRecord,
  PupilResponseDto,
  UpdatePupilDto,
} from "./pupil.interface";

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

export const parsePupilIdParam = (
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

export const parseCreatePupilDto = (payload: unknown): CreatePupilDto => {
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
  };
};

export const parseUpdatePupilDto = (payload: unknown): UpdatePupilDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdatePupilDto = {};

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

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toPupilResponseDto = (pupil: PupilRecord): PupilResponseDto => ({
  id: pupil.id,
  lrn: pupil.lrn,
  firstName: pupil.firstName,
  middleName: pupil.middleName,
  lastName: pupil.lastName,
  suffix: pupil.suffix,
  sex: pupil.sex,
  birthdate: pupil.birthdate,
  birthplace: pupil.birthplace,
  streetAddress: pupil.streetAddress,
  barangay: pupil.barangay,
  cityMunicipality: pupil.cityMunicipality,
  province: pupil.province,
  region: pupil.region,
  status: pupil.status,
  createdAt: toIsoString(pupil.createdAt),
  updatedAt: toIsoString(pupil.updatedAt),
  deletedAt: toNullableIsoString(pupil.deletedAt),
});
