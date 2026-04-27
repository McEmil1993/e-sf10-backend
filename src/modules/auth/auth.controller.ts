import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { HttpError } from "../../common/utils/http-error";
import { parseLoginDto, parseRegisterDto } from "./auth.dto";
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
};
