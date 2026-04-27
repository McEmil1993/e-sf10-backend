import { HttpError } from "../../common/utils/http-error";

export interface RegisterDto {
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

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

const getOptionalString = (value: unknown): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, "lastName must be a string.");
  }

  return value.trim();
};

export const parseRegisterDto = (payload: unknown): RegisterDto => {
  const body = getBodyObject(payload);

  const email = getRequiredString(body.email, "email").toLowerCase();
  const password = getRequiredString(body.password, "password");
  const firstName = getRequiredString(body.firstName, "firstName");
  const lastName = getOptionalString(body.lastName);

  if (!email.includes("@")) {
    throw new HttpError(400, "email must be a valid email address.");
  }

  if (password.length < 6) {
    throw new HttpError(400, "password must be at least 6 characters long.");
  }

  return {
    email,
    password,
    firstName,
    lastName,
  };
};

export const parseLoginDto = (payload: unknown): LoginDto => {
  const body = getBodyObject(payload);

  return {
    email: getRequiredString(body.email, "email").toLowerCase(),
    password: getRequiredString(body.password, "password"),
  };
};
