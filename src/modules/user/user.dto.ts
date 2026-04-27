import { HttpError } from "../../common/utils/http-error";
import type {
  ChangeCurrentPasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserRecord,
  UserResponseDto,
} from "./user.interface";

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

const getOptionalNullableString = (value: unknown, fieldName: string): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string.`);
  }

  return value.trim();
};

const getOptionalRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
};

const getEmail = (value: unknown, fieldName: string): string => {
  const email = getOptionalRequiredString(value, fieldName).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, `${fieldName} must be a valid email address.`);
  }

  return email;
};

const getPassword = (value: unknown, fieldName: string): string => {
  const password = getOptionalRequiredString(value, fieldName);

  if (password.length < 6) {
    throw new HttpError(400, `${fieldName} must be at least 6 characters long.`);
  }

  return password;
};

const getUsername = (value: unknown, fieldName: string): string | null => {
  const username = getOptionalNullableString(value, fieldName);

  if (!username) {
    return null;
  }

  const normalizedUsername = username.toLowerCase();

  if (!/^[a-z0-9._-]+$/.test(normalizedUsername)) {
    throw new HttpError(
      400,
      `${fieldName} must only contain lowercase letters, numbers, dots, underscores, or hyphens.`,
    );
  }

  return normalizedUsername;
};

const getNormalizedLowercaseString = (value: unknown, fieldName: string): string => {
  return getOptionalRequiredString(value, fieldName).toLowerCase();
};

const getRoles = (value: unknown, fieldName: string): string[] => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an array of strings.`);
  }

  const roles = value.map((item, index) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new HttpError(400, `${fieldName}[${index}] must be a non-empty string.`);
    }

    return item.trim().toLowerCase();
  });

  return Array.from(new Set(roles));
};

export const parseUserIdParam = (
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

export const parseCreateUserDto = (payload: unknown): CreateUserDto => {
  const body = getBodyObject(payload);

  return {
    name: getOptionalNullableString(body.name, "name"),
    firstName: getRequiredString(body.firstName, "firstName"),
    middleName: getOptionalNullableString(body.middleName, "middleName"),
    lastName: getOptionalNullableString(body.lastName, "lastName"),
    suffix: getOptionalNullableString(body.suffix, "suffix"),
    sex: body.sex === undefined ? null : getNormalizedLowercaseString(body.sex, "sex"),
    email: getEmail(body.email, "email"),
    contactNumber: getOptionalNullableString(body.contactNumber, "contactNumber"),
    address: getOptionalNullableString(body.address, "address"),
    barangay: getOptionalNullableString(body.barangay, "barangay"),
    municipalityCity: getOptionalNullableString(body.municipalityCity, "municipalityCity"),
    province: getOptionalNullableString(body.province, "province"),
    region: getOptionalNullableString(body.region, "region"),
    username: getUsername(body.username, "username"),
    password: getPassword(body.password, "password"),
    roles: body.roles === undefined ? ["user"] : getRoles(body.roles, "roles"),
    position: getOptionalNullableString(body.position, "position"),
    status: body.status === undefined ? "active" : getNormalizedLowercaseString(body.status, "status"),
    profilePicture: getOptionalNullableString(body.profilePicture, "profilePicture"),
  };
};

export const parseUpdateUserDto = (payload: unknown): UpdateUserDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateUserDto = {};

  if ("name" in body) {
    updatePayload.name = getOptionalNullableString(body.name, "name");
  }

  if ("firstName" in body) {
    updatePayload.firstName = getOptionalRequiredString(body.firstName, "firstName");
  }

  if ("middleName" in body) {
    updatePayload.middleName = getOptionalNullableString(body.middleName, "middleName");
  }

  if ("lastName" in body) {
    updatePayload.lastName = getOptionalNullableString(body.lastName, "lastName");
  }

  if ("suffix" in body) {
    updatePayload.suffix = getOptionalNullableString(body.suffix, "suffix");
  }

  if ("sex" in body) {
    updatePayload.sex = getOptionalNullableString(body.sex, "sex")?.toLowerCase() ?? null;
  }

  if ("email" in body) {
    updatePayload.email = getEmail(body.email, "email");
  }

  if ("contactNumber" in body) {
    updatePayload.contactNumber = getOptionalNullableString(body.contactNumber, "contactNumber");
  }

  if ("address" in body) {
    updatePayload.address = getOptionalNullableString(body.address, "address");
  }

  if ("barangay" in body) {
    updatePayload.barangay = getOptionalNullableString(body.barangay, "barangay");
  }

  if ("municipalityCity" in body) {
    updatePayload.municipalityCity = getOptionalNullableString(body.municipalityCity, "municipalityCity");
  }

  if ("province" in body) {
    updatePayload.province = getOptionalNullableString(body.province, "province");
  }

  if ("region" in body) {
    updatePayload.region = getOptionalNullableString(body.region, "region");
  }

  if ("username" in body) {
    updatePayload.username = getUsername(body.username, "username");
  }

  if ("password" in body) {
    updatePayload.password = getPassword(body.password, "password");
  }

  if ("roles" in body) {
    updatePayload.roles = getRoles(body.roles, "roles");
  }

  if ("position" in body) {
    updatePayload.position = getOptionalNullableString(body.position, "position");
  }

  if ("status" in body) {
    updatePayload.status = getNormalizedLowercaseString(body.status, "status");
  }

  if ("profilePicture" in body) {
    updatePayload.profilePicture = getOptionalNullableString(body.profilePicture, "profilePicture");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const parseChangeCurrentPasswordDto = (payload: unknown): ChangeCurrentPasswordDto => {
  const body = getBodyObject(payload);
  const currentPassword = getPassword(body.currentPassword, "currentPassword");
  const newPassword = getPassword(body.newPassword, "newPassword");

  if (currentPassword === newPassword) {
    throw new HttpError(400, "newPassword must be different from currentPassword.");
  }

  return {
    currentPassword,
    newPassword,
  };
};

export const toUserResponseDto = (user: UserRecord): UserResponseDto => {
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    suffix: user.suffix,
    sex: user.sex,
    email: user.email,
    contactNumber: user.contactNumber,
    address: user.address,
    barangay: user.barangay,
    municipalityCity: user.municipalityCity,
    province: user.province,
    region: user.region,
    username: user.username,
    roles: user.roles,
    position: user.position,
    status: user.status,
    profilePicture: user.profilePicture,
    createdAt: toIsoString(user.createdAt),
    updatedAt: toIsoString(user.updatedAt),
    deletedAt: toNullableIsoString(user.deletedAt),
  };
};
