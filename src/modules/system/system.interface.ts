import type { RowDataPacket } from "mysql2";

export interface SchoolBaseFields {
  depedSchoolId: string;
  schoolName: string;
  schoolEmail: string | null;
  schoolNumber: string | null;
  district: string;
  division: string;
  region: string;
  address: string;
  schoolLogo: string | null;
  depedLogo: string | null;
  otherLogo: string | null;
}

export interface SchoolRecord extends SchoolBaseFields {
  schoolId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface UpdateSchoolInput extends SchoolBaseFields {}

export interface UpdateSchoolDto {
  depedSchoolId?: string;
  schoolName?: string;
  schoolEmail?: string | null;
  schoolNumber?: string | null;
  district?: string;
  division?: string;
  region?: string;
  address?: string;
  schoolLogo?: string | null;
  depedLogo?: string | null;
  otherLogo?: string | null;
}

export interface SchoolResponseDto extends SchoolBaseFields {
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SchoolRow extends RowDataPacket {
  schoolId: number;
  depedSchoolId: string;
  schoolName: string;
  schoolEmail: string | null;
  schoolNumber: string | null;
  district: string;
  division: string;
  region: string;
  address: string;
  schoolLogo: string | null;
  depedLogo: string | null;
  otherLogo: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export type EmailTemplateKey = "password_recovery" | "official_notices" | "otp";
export type ForgotPasswordMethod = "temporary_password" | "otp_email";

export interface EmailSmtpSettingsRecord {
  id: number;
  provider: "gmail";
  gmailEmail: string;
  gmailAppPassword: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  isEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EmailSmtpSettingsRow extends RowDataPacket {
  id: number;
  provider: "gmail";
  gmailEmail: string;
  gmailAppPassword: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: 0 | 1 | boolean;
  isEnabled: 0 | 1 | boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EmailSmtpSettingsResponseDto {
  id: number | null;
  provider: "gmail";
  gmailEmail: string;
  gmailAppPassword: string;
  hasGmailAppPassword: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  isEnabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateEmailSmtpSettingsDto {
  gmailEmail?: string;
  gmailAppPassword?: string;
  smtpSecure?: boolean;
  isEnabled?: boolean;
}

export interface UpdateEmailSmtpSettingsInput {
  gmailEmail: string;
  gmailAppPassword: string;
  smtpSecure: boolean;
  isEnabled: boolean;
}

export interface EmailTemplateRecord {
  id: number;
  templateKey: EmailTemplateKey;
  templateName: string;
  subject: string;
  htmlContent: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface EmailTemplateRow extends RowDataPacket {
  id: number;
  templateKey: EmailTemplateKey;
  templateName: string;
  subject: string;
  htmlContent: string;
  isActive: 0 | 1 | boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface EmailTemplateResponseDto {
  id: number;
  templateKey: EmailTemplateKey;
  templateName: string;
  subject: string;
  htmlContent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpsertEmailTemplateDto {
  templateKey: EmailTemplateKey;
  templateName: string;
  subject: string;
  htmlContent: string;
  isActive?: boolean;
}

export interface PasswordRecoverySettingsResponseDto {
  forgotPasswordMethod: ForgotPasswordMethod;
}

export interface UpdatePasswordRecoverySettingsDto {
  forgotPasswordMethod: ForgotPasswordMethod;
}

export interface PrincipalSettingsRecord {
  activePrincipalUserId: number | null;
  activePrincipalName: string | null;
  activePrincipalEmail: string | null;
  activePrincipalPosition: string | null;
}

export interface PrincipalSettingsResponseDto extends PrincipalSettingsRecord {}

export interface UpdatePrincipalSettingsDto {
  activePrincipalUserId: number | null;
}
