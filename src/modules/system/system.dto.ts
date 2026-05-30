import { HttpError } from "../../common/utils/http-error";
import type {
  EmailSmtpSettingsRecord,
  EmailSmtpSettingsResponseDto,
  EmailTemplateKey,
  EmailTemplateRecord,
  EmailTemplateResponseDto,
  ForgotPasswordMethod,
  PasswordRecoverySettingsResponseDto,
  SchoolRecord,
  SchoolResponseDto,
  UpdateEmailSmtpSettingsDto,
  UpdatePasswordRecoverySettingsDto,
  UpdateSchoolDto,
  UpsertEmailTemplateDto,
} from "./system.interface";

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

const emailTemplateKeys = new Set<EmailTemplateKey>(["password_recovery", "official_notices", "otp"]);
const forgotPasswordMethods = new Set<ForgotPasswordMethod>(["temporary_password", "otp_email"]);

const getOptionalString = (value: unknown, fieldName: string): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string or null.`);
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

const getOptionalEmail = (value: unknown, fieldName: string): string | null => {
  const email = getOptionalString(value, fieldName);

  if (!email) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, `${fieldName} must be a valid email address.`);
  }

  return email.toLowerCase();
};

const getBoolean = (value: unknown, fieldName: string): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  throw new HttpError(400, `${fieldName} must be a boolean.`);
};

const getTemplateKey = (value: unknown): EmailTemplateKey => {
  if (typeof value !== "string" || !emailTemplateKeys.has(value as EmailTemplateKey)) {
    throw new HttpError(400, "templateKey must be password_recovery, official_notices, or otp.");
  }

  return value as EmailTemplateKey;
};

const getForgotPasswordMethod = (value: unknown): ForgotPasswordMethod => {
  if (typeof value !== "string" || !forgotPasswordMethods.has(value as ForgotPasswordMethod)) {
    throw new HttpError(400, "forgotPasswordMethod must be temporary_password or otp_email.");
  }

  return value as ForgotPasswordMethod;
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

  if ("schoolEmail" in body) {
    updatePayload.schoolEmail = getOptionalEmail(body.schoolEmail, "schoolEmail");
  }

  if ("schoolNumber" in body) {
    updatePayload.schoolNumber = getOptionalString(body.schoolNumber, "schoolNumber");
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
    schoolEmail: school.schoolEmail,
    schoolNumber: school.schoolNumber,
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

export const parseUpdateEmailSmtpSettingsDto = (payload: unknown): UpdateEmailSmtpSettingsDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateEmailSmtpSettingsDto = {};

  if ("gmailEmail" in body) {
    const gmailEmail = getOptionalEmail(body.gmailEmail, "gmailEmail");
    updatePayload.gmailEmail = gmailEmail ?? "";
  }

  if ("gmailAppPassword" in body) {
    const gmailAppPassword = getOptionalString(body.gmailAppPassword, "gmailAppPassword");

    if (gmailAppPassword) {
      updatePayload.gmailAppPassword = gmailAppPassword;
    }
  }

  if ("smtpSecure" in body) {
    updatePayload.smtpSecure = getBoolean(body.smtpSecure, "smtpSecure");
  }

  if ("isEnabled" in body) {
    updatePayload.isEnabled = getBoolean(body.isEnabled, "isEnabled");
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one SMTP setting field is required for update.");
  }

  return updatePayload;
};

export const parseUpsertEmailTemplateDto = (payload: unknown): UpsertEmailTemplateDto => {
  const body = getBodyObject(payload);
  const dto: UpsertEmailTemplateDto = {
    templateKey: getTemplateKey(body.templateKey),
    templateName: getRequiredString(body.templateName, "templateName"),
    subject: getRequiredString(body.subject, "subject"),
    htmlContent: getRequiredString(body.htmlContent, "htmlContent"),
  };

  if ("isActive" in body) {
    dto.isActive = getBoolean(body.isActive, "isActive");
  }

  return dto;
};

export const parseEmailTemplateKey = (value: unknown): EmailTemplateKey | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return getTemplateKey(value);
};

export const parseUpdatePasswordRecoverySettingsDto = (
  payload: unknown,
): UpdatePasswordRecoverySettingsDto => {
  const body = getBodyObject(payload);

  return {
    forgotPasswordMethod: getForgotPasswordMethod(body.forgotPasswordMethod),
  };
};

export const toPasswordRecoverySettingsResponseDto = (
  forgotPasswordMethod: string | null,
): PasswordRecoverySettingsResponseDto => {
  return {
    forgotPasswordMethod: forgotPasswordMethods.has(forgotPasswordMethod as ForgotPasswordMethod)
      ? (forgotPasswordMethod as ForgotPasswordMethod)
      : "temporary_password",
  };
};

export const toEmailSmtpSettingsResponseDto = (
  settings: EmailSmtpSettingsRecord | null,
): EmailSmtpSettingsResponseDto => {
  if (!settings) {
    return {
      id: null,
      provider: "gmail",
      gmailEmail: "",
      gmailAppPassword: "",
      hasGmailAppPassword: false,
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpSecure: false,
      isEnabled: false,
      createdAt: null,
      updatedAt: null,
    };
  }

  return {
    id: settings.id,
    provider: "gmail",
    gmailEmail: settings.gmailEmail,
    gmailAppPassword: settings.gmailAppPassword ? "********" : "",
    hasGmailAppPassword: settings.gmailAppPassword.length > 0,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpSecure: settings.smtpSecure,
    isEnabled: settings.isEnabled,
    createdAt: toIsoString(settings.createdAt),
    updatedAt: toIsoString(settings.updatedAt),
  };
};

export const toEmailTemplateResponseDto = (template: EmailTemplateRecord): EmailTemplateResponseDto => {
  return {
    id: template.id,
    templateKey: template.templateKey,
    templateName: template.templateName,
    subject: template.subject,
    htmlContent: template.htmlContent,
    isActive: template.isActive,
    createdAt: toIsoString(template.createdAt),
    updatedAt: toIsoString(template.updatedAt),
    deletedAt: toNullableIsoString(template.deletedAt),
  };
};
