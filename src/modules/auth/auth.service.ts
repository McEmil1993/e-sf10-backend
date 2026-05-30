import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

import { BCRYPT_SALT_ROUNDS } from "../../config/constants";
import { env } from "../../config/env";
import { HttpError } from "../../common/utils/http-error";
import { authTokenBlacklist } from "../../common/utils/auth-token-blacklist";
import { toUserResponseDto } from "../user/user.dto";
import type { UserRecord } from "../user/user.interface";
import type {
  CompleteTemporaryPasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  VerifyForgotPasswordOtpDto,
} from "./auth.dto";
import { authRepository } from "./auth.repository";
import { systemRepository } from "../system/system.repository";

const generateAccessToken = (user: UserRecord): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const expiresIn = env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const generateTemporaryPassword = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(10);

  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
};

const generateOtpCode = (): string => {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};

const replaceTemplatePlaceholders = (template: string, values: Record<string, string>): string => {
  return template.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (match, key: string) => {
    return values[key] ?? values[key.toLowerCase()] ?? match;
  });
};

const hasTemporaryPasswordPlaceholder = (template: string): boolean => {
  return /\{\{\s*(temporaryPassword|temporary_password|TEMPORARY_PASSWORD)\s*\}\}/.test(template);
};

const hasOtpPlaceholder = (template: string): boolean => {
  return /\{\{\s*(otpCode|otp_code|OTP_CODE)\s*\}\}/.test(template);
};

const defaultTemporaryPasswordTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Temporary Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: Arial, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; background: #f1f5f9; }
    .wrapper-cell { padding: 24px; text-align: center; }
    .card { width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(15,23,42,0.12); }
    .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; }
    .content { padding: 30px; text-align: center; }
    .content h2 { color: #0f172a; font-size: 20px; }
    .content p { color: #475569; font-size: 14px; line-height: 1.6; }
    .password { display: inline-block; margin: 20px 0; padding: 14px 22px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; color: #1d4ed8; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
    .warning { color: #b91c1c; font-size: 13px; }
    .footer { padding: 20px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; font-size: 12px; }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td class="wrapper-cell" align="center">
        <div class="card">
          <div class="header"><h1>{{schoolName}}</h1></div>
          <div class="content">
            <h2>Temporary Password</h2>
            <p>Hello {{recipientName}},</p>
            <p>Use the temporary password below to sign in.</p>
            <div class="password">{{temporaryPassword}}</div>
            <p class="warning">This temporary password expires in 1 hour.</p>
          </div>
          <div class="footer">{{schoolEmail}} {{schoolNumber}}</div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

const defaultOtpTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Reset OTP</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: Arial, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; background: #f1f5f9; }
    .wrapper-cell { padding: 24px; text-align: center; }
    .card { width: 100%; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(15,23,42,0.12); }
    .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 28px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; }
    .content { padding: 30px; text-align: center; }
    .content p { color: #475569; font-size: 14px; line-height: 1.6; }
    .code { display: inline-block; margin: 20px 0; padding: 14px 22px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; color: #1d4ed8; font-size: 30px; font-weight: bold; letter-spacing: 8px; }
    .warning { color: #b91c1c; font-size: 13px; }
    .footer { padding: 20px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; font-size: 12px; }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td class="wrapper-cell" align="center">
        <div class="card">
          <div class="header"><h1>{{schoolName}}</h1></div>
          <div class="content">
            <p>Hello {{recipientName}},</p>
            <p>Use this 6-digit verification code to reset your password.</p>
            <div class="code">{{otpCode}}</div>
            <p class="warning">This code expires in {{expiresIn}}.</p>
          </div>
          <div class="footer">{{schoolEmail}} {{schoolNumber}}</div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const authService = {
  async register(payload: RegisterDto) {
    const existingUser = await authRepository.findByEmailIncludingDeleted(payload.email.toLowerCase());

    if (existingUser) {
      throw new HttpError(409, "Email is already registered.");
    }

    const passwordHash = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);
    const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();

    const createdUser = await authRepository.createUser({
      name: fullName || payload.firstName,
      firstName: payload.firstName,
      middleName: null,
      lastName: payload.lastName,
      suffix: null,
      sex: null,
      email: payload.email.toLowerCase(),
      contactNumber: null,
      address: null,
      barangay: null,
      municipalityCity: null,
      province: null,
      region: null,
      username: null,
      passwordHash,
      roles: ["user"],
      position: null,
      status: "active",
      profilePicture: null,
    });

    return {
      user: toUserResponseDto(createdUser),
      token: generateAccessToken(createdUser),
    };
  },

  async login(payload: LoginDto) {
    const user = payload.identifierType === "email"
      ? await authRepository.findByEmail(payload.identifier)
      : await authRepository.findByUsername(payload.identifier);

    if (!user) {
      throw new HttpError(
        401,
        payload.identifierType === "email" ? "Email not exist!" : "Username not exist!",
      );
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    let temporaryPasswordLogin: { required: true; recoveryRequestId: number; expiresAt: string } | null = null;

    if (!isPasswordValid) {
      const recoveryRequest = await authRepository.findActivePasswordRecoveryRequest(user.id);

      if (
        !recoveryRequest ||
        !recoveryRequest.temporaryPasswordHash ||
        !(await bcrypt.compare(payload.password, recoveryRequest.temporaryPasswordHash))
      ) {
        throw new HttpError(401, "Wrong password!");
      }

      temporaryPasswordLogin = {
        required: true,
        recoveryRequestId: recoveryRequest.id,
        expiresAt: new Date(recoveryRequest.expiresAt).toISOString(),
      };
    }

    return {
      user: toUserResponseDto(user),
      token: generateAccessToken(user),
      temporaryPasswordLogin,
    };
  },

  async logout(token: string | undefined, expiresAt?: number) {
    if (!token) {
      throw new HttpError(401, "Authentication token is missing or invalid.");
    }

    authTokenBlacklist.blacklistToken(token, expiresAt);
  },

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = payload.identifierType === "email"
      ? await authRepository.findByEmail(payload.identifier)
      : await authRepository.findByUsername(payload.identifier);

    if (!user) {
      throw new HttpError(
        404,
        payload.identifierType === "email" ? "Email not exist!" : "Username not exist!",
      );
    }

    const smtpSettings = await systemRepository.getEmailSmtpSettings();

    if (!smtpSettings?.isEnabled || !smtpSettings.gmailEmail || !smtpSettings.gmailAppPassword) {
      throw new HttpError(400, "Gmail SMTP settings are not configured.");
    }

    const forgotPasswordMethod = await systemRepository.getForgotPasswordMethod();
    const [school, templates] = await Promise.all([
      systemRepository.getSchool(),
      systemRepository.listEmailTemplates(
        forgotPasswordMethod === "otp_email" ? "otp" : "password_recovery",
      ),
    ]);
    const activeTemplate = templates.find((template) => template.isActive);
    const transporter = nodemailer.createTransport({
      host: smtpSettings.smtpHost,
      port: smtpSettings.smtpPort,
      secure: smtpSettings.smtpSecure,
      auth: {
        user: smtpSettings.gmailEmail,
        pass: smtpSettings.gmailAppPassword,
      },
    });
    const basePlaceholders = {
      schoolName: school?.schoolName ?? "E-SF10 System",
      SCHOOL_NAME: school?.schoolName ?? "E-SF10 System",
      schoolEmail: school?.schoolEmail ?? smtpSettings.gmailEmail,
      SCHOOL_EMAIL: school?.schoolEmail ?? smtpSettings.gmailEmail,
      schoolNumber: school?.schoolNumber ?? "",
      SCHOOL_NUMBER: school?.schoolNumber ?? "",
      recipientName: user.name || user.email,
      RECIPIENT_NAME: user.name || user.email,
    };

    await authRepository.deleteActivePasswordRecoveryRequests(user.id);

    if (forgotPasswordMethod === "otp_email") {
      const otpCode = generateOtpCode();
      const otpCodeHash = await bcrypt.hash(otpCode, BCRYPT_SALT_ROUNDS);
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
      const recoveryRequestId = await authRepository.createOtpRecoveryRequest(
        user.id,
        user.email,
        otpCodeHash,
        expiresAt,
      );
      const htmlTemplate = activeTemplate && hasOtpPlaceholder(activeTemplate.htmlContent)
        ? activeTemplate.htmlContent
        : defaultOtpTemplate;
      const subjectTemplate = activeTemplate?.subject ?? "Password Reset OTP";
      const placeholders = {
        ...basePlaceholders,
        otpCode,
        otp_code: otpCode,
        OTP_CODE: otpCode,
        expiresIn: "2 minutes",
        expires_in: "2 minutes",
        EXPIRES_IN: "2 minutes",
      };

      await transporter.sendMail({
        from: smtpSettings.gmailEmail,
        to: user.email,
        subject: replaceTemplatePlaceholders(subjectTemplate, placeholders),
        html: replaceTemplatePlaceholders(htmlTemplate, placeholders),
      });

      return {
        method: "otp_email" as const,
        email: user.email,
        recoveryRequestId,
        expiresAt: expiresAt.toISOString(),
      };
    }

    const temporaryPassword = generateTemporaryPassword();
    const temporaryPasswordHash = await bcrypt.hash(temporaryPassword, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const recoveryRequestId = await authRepository.createPasswordRecoveryRequest(
      user.id,
      user.email,
      temporaryPasswordHash,
      expiresAt,
    );
    const htmlTemplate = activeTemplate && hasTemporaryPasswordPlaceholder(activeTemplate.htmlContent)
      ? activeTemplate.htmlContent
      : defaultTemporaryPasswordTemplate;
    const subjectTemplate = activeTemplate?.subject ?? "Temporary Password";
    const placeholders = {
      ...basePlaceholders,
      temporaryPassword,
      temporary_password: temporaryPassword,
      TEMPORARY_PASSWORD: temporaryPassword,
      expiresIn: "1 hour",
      expires_in: "1 hour",
      EXPIRES_IN: "1 hour",
    };

    await transporter.sendMail({
      from: smtpSettings.gmailEmail,
      to: user.email,
      subject: replaceTemplatePlaceholders(subjectTemplate, placeholders),
      html: replaceTemplatePlaceholders(htmlTemplate, placeholders),
    });

    return {
      method: "temporary_password" as const,
      recoveryRequestId,
      expiresAt: expiresAt.toISOString(),
    };
  },

  async verifyForgotPasswordOtp(payload: VerifyForgotPasswordOtpDto) {
    const recoveryRequest = await authRepository.findActiveOtpRecoveryRequestById(
      payload.recoveryRequestId,
      payload.email,
    );

    if (!recoveryRequest?.otpCodeHash) {
      throw new HttpError(403, "OTP is invalid or expired.");
    }

    const isOtpValid = await bcrypt.compare(payload.otpCode, recoveryRequest.otpCodeHash);

    if (!isOtpValid) {
      throw new HttpError(403, "OTP is invalid or expired.");
    }

    const [user, isVerified] = await Promise.all([
      authRepository.findById(recoveryRequest.userId),
      authRepository.verifyOtpRecoveryRequest(recoveryRequest.id, recoveryRequest.userId),
    ]);

    if (!user || !isVerified) {
      throw new HttpError(403, "OTP is invalid or expired.");
    }

    const verifiedRecoveryRequest = await authRepository.findActivePasswordRecoveryRequestById(
      recoveryRequest.id,
      user.id,
    );

    if (!verifiedRecoveryRequest) {
      throw new HttpError(403, "OTP is invalid or expired.");
    }

    return {
      user: toUserResponseDto(user),
      token: generateAccessToken(user),
      temporaryPasswordLogin: {
        required: true,
        recoveryRequestId: verifiedRecoveryRequest.id,
        expiresAt: new Date(verifiedRecoveryRequest.expiresAt).toISOString(),
      },
    };
  },

  async validateTemporaryPasswordSession(userId: number, recoveryRequestId: number) {
    const [user, recoveryRequest] = await Promise.all([
      authRepository.findById(userId),
      authRepository.findActivePasswordRecoveryRequestById(recoveryRequestId, userId),
    ]);

    if (!user || !recoveryRequest) {
      throw new HttpError(403, "Temporary password session is invalid or expired.");
    }

    return {
      user: toUserResponseDto(user),
      temporaryPasswordLogin: {
        required: true,
        recoveryRequestId: recoveryRequest.id,
        expiresAt: new Date(recoveryRequest.expiresAt).toISOString(),
      },
    };
  },

  async completeTemporaryPassword(userId: number, payload: CompleteTemporaryPasswordDto) {
    const recoveryRequest = await authRepository.findActivePasswordRecoveryRequestById(
      payload.recoveryRequestId,
      userId,
    );

    if (!recoveryRequest) {
      throw new HttpError(403, "Temporary password session is invalid or expired.");
    }

    const newPasswordHash = await bcrypt.hash(payload.newPassword, BCRYPT_SALT_ROUNDS);
    await authRepository.updatePasswordHash(userId, newPasswordHash);

    const isCompleted = await authRepository.completePasswordRecoveryRequest(
      payload.recoveryRequestId,
      userId,
    );

    if (!isCompleted) {
      throw new HttpError(403, "Temporary password session is invalid or expired.");
    }

    const updatedUser = await authRepository.findById(userId);

    if (!updatedUser) {
      throw new HttpError(404, "User not found.");
    }

    return {
      user: toUserResponseDto(updatedUser),
      token: generateAccessToken(updatedUser),
      temporaryPasswordLogin: null,
    };
  },
};
