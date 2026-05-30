import { HttpError } from "../../common/utils/http-error";

export interface RegisterDto {
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
}

export interface LoginDto {
  identifier: string;
  identifierType: "email" | "username";
  password: string;
}

export interface ForgotPasswordDto {
  identifier: string;
  identifierType: "email" | "username";
}

export interface CompleteTemporaryPasswordDto {
  recoveryRequestId: number;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerifyForgotPasswordOtpDto {
  recoveryRequestId: number;
  email: string;
  otpCode: string;
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
  const identifier = getRequiredString(
    body.identifier ?? body.email ?? body.username,
    "username/email",
  ).toLowerCase();

  return {
    identifier,
    identifierType: identifier.includes("@") ? "email" : "username",
    password: getRequiredString(body.password, "password"),
  };
};

export const parseForgotPasswordDto = (payload: unknown): ForgotPasswordDto => {
  const body = getBodyObject(payload);
  const identifier = getRequiredString(
    body.identifier ?? body.email ?? body.username,
    "email/username",
  ).toLowerCase();

  if (identifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
    throw new HttpError(400, "email must be a valid email address.");
  }

  return {
    identifier,
    identifierType: identifier.includes("@") ? "email" : "username",
  };
};

const getRequiredPositiveInteger = (value: unknown, fieldName: string): number => {
  const parsedValue = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

const getPassword = (value: unknown, fieldName: string): string => {
  const password = getRequiredString(value, fieldName);

  if (password.length < 6) {
    throw new HttpError(400, `${fieldName} must be at least 6 characters long.`);
  }

  return password;
};

export const parseRecoveryRequestIdParam = (value: string | string[] | undefined): number => {
  if (Array.isArray(value)) {
    throw new HttpError(400, "recoveryRequestId must be a valid positive integer.");
  }

  return getRequiredPositiveInteger(value, "recoveryRequestId");
};

export const parseCompleteTemporaryPasswordDto = (payload: unknown): CompleteTemporaryPasswordDto => {
  const body = getBodyObject(payload);
  const newPassword = getPassword(body.newPassword, "newPassword");
  const confirmNewPassword = getPassword(body.confirmNewPassword, "confirmNewPassword");

  if (newPassword !== confirmNewPassword) {
    throw new HttpError(400, "confirmNewPassword must match newPassword.");
  }

  return {
    recoveryRequestId: getRequiredPositiveInteger(body.recoveryRequestId, "recoveryRequestId"),
    newPassword,
    confirmNewPassword,
  };
};

export const parseVerifyForgotPasswordOtpDto = (payload: unknown): VerifyForgotPasswordOtpDto => {
  const body = getBodyObject(payload);
  const email = getRequiredString(body.email, "email").toLowerCase();
  const otpCode = getRequiredString(body.otpCode, "otpCode");

  if (!email.includes("@")) {
    throw new HttpError(400, "email must be a valid email address.");
  }

  if (!/^\d{6}$/.test(otpCode)) {
    throw new HttpError(400, "otpCode must be a 6-digit code.");
  }

  return {
    recoveryRequestId: getRequiredPositiveInteger(body.recoveryRequestId, "recoveryRequestId"),
    email,
    otpCode,
  };
};
