import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { HttpError } from "../../common/utils/http-error";
import {
  parseCompleteTemporaryPasswordDto,
  parseForgotPasswordDto,
  parseLoginDto,
  parseRecoveryRequestIdParam,
  parseRegisterDto,
  parseVerifyForgotPasswordOtpDto,
} from "./auth.dto";
import { authService } from "./auth.service";

export const authController = {
  async register(request: Request, response: Response): Promise<void> {
    const payload = parseRegisterDto(request.body);
    const result = await authService.register(payload);

    sendSuccess(response, 201, "User registered successfully.", result);
  },

  async login(request: Request, response: Response): Promise<void> {
    const payload = parseLoginDto(request.body);
    const result = await authService.login(payload);

    sendSuccess(response, 200, "Login successful.", result);
  },

  async logout(request: Request, response: Response): Promise<void> {
    if (!request.authUser) {
      throw new HttpError(401, "Authentication token is missing or invalid.");
    }

    await authService.logout(request.authToken, request.authUser.expiresAt);
    sendSuccess(response, 200, "Logout successful.");
  },

  async forgotPassword(request: Request, response: Response): Promise<void> {
    const payload = parseForgotPasswordDto(request.body);
    const result = await authService.forgotPassword(payload);

    sendSuccess(
      response,
      200,
      result.method === "otp_email"
        ? "OTP sent. It expires in 2 minutes."
        : "Temporary password sent. It expires in 1 hour.",
      result,
    );
  },

  async verifyForgotPasswordOtp(request: Request, response: Response): Promise<void> {
    const payload = parseVerifyForgotPasswordOtpDto(request.body);
    const result = await authService.verifyForgotPasswordOtp(payload);

    sendSuccess(response, 200, "OTP verified successfully.", result);
  },

  async getTemporaryPasswordSession(request: Request, response: Response): Promise<void> {
    if (!request.authUser) {
      throw new HttpError(401, "Authentication token is missing or invalid.");
    }

    const recoveryRequestId = parseRecoveryRequestIdParam(request.params.recoveryRequestId);
    const result = await authService.validateTemporaryPasswordSession(
      request.authUser.userId,
      recoveryRequestId,
    );

    sendSuccess(response, 200, "Temporary password session is valid.", result);
  },

  async completeTemporaryPassword(request: Request, response: Response): Promise<void> {
    if (!request.authUser) {
      throw new HttpError(401, "Authentication token is missing or invalid.");
    }

    const payload = parseCompleteTemporaryPasswordDto(request.body);
    const result = await authService.completeTemporaryPassword(request.authUser.userId, payload);

    sendSuccess(response, 200, "Password changed successfully.", result);
  },
};
