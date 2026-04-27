import type { Request, Response } from "express";

import { sendError, sendSuccess } from "../../common/response";
import {
  parseChangeCurrentPasswordDto,
  parseCreateUserDto,
  parseUpdateUserDto,
  parseUserIdParam,
} from "./user.dto";
import { userService } from "./user.service";

export const userController = {
  async getAllUsers(_request: Request, response: Response): Promise<void> {
    const users = await userService.getAllUsers();
    sendSuccess(response, 200, "Users fetched successfully.", users);
  },

  async createUser(request: Request, response: Response): Promise<void> {
    const payload = parseCreateUserDto(request.body);
    const user = await userService.createUser(payload);
    sendSuccess(response, 201, "User created successfully.", user);
  },

  async getUserById(request: Request, response: Response): Promise<void> {
    const userId = parseUserIdParam(request.params.id);
    const user = await userService.getUserById(userId);
    sendSuccess(response, 200, "User fetched successfully.", user);
  },

  async updateUser(request: Request, response: Response): Promise<void> {
    const userId = parseUserIdParam(request.params.id);
    const payload = parseUpdateUserDto(request.body);
    const user = await userService.updateUser(userId, payload);
    sendSuccess(response, 200, "User updated successfully.", user);
  },

  async deleteUser(request: Request, response: Response): Promise<void> {
    const userId = parseUserIdParam(request.params.id);
    await userService.deleteUser(userId);
    sendSuccess(response, 200, "User soft deleted successfully.");
  },

  async getCurrentUser(request: Request, response: Response): Promise<void> {
    const currentUser = request.authUser;

    if (!currentUser) {
      sendError(response, 401, "Unauthorized.");
      return;
    }

    const user = await userService.getCurrentUser(currentUser.userId);
    sendSuccess(response, 200, "Current user fetched successfully.", user);
  },

  async updateCurrentUser(request: Request, response: Response): Promise<void> {
    const currentUser = request.authUser;

    if (!currentUser) {
      sendError(response, 401, "Unauthorized.");
      return;
    }

    const payload = parseUpdateUserDto(request.body);
    const user = await userService.updateCurrentUser(currentUser.userId, payload);
    sendSuccess(response, 200, "Current user updated successfully.", user);
  },

  async changeCurrentPassword(request: Request, response: Response): Promise<void> {
    const currentUser = request.authUser;

    if (!currentUser) {
      sendError(response, 401, "Unauthorized.");
      return;
    }

    const payload = parseChangeCurrentPasswordDto(request.body);
    await userService.changeCurrentPassword(currentUser.userId, payload);
    sendSuccess(response, 200, "Password updated successfully.");
  },
};
