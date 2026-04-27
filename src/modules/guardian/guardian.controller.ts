import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreateGuardianDto,
  parseGuardianIdParam,
  parseUpdateGuardianDto,
} from "./guardian.dto";
import { guardianService } from "./guardian.service";

export const guardianController = {
  async getAllGuardians(_request: Request, response: Response): Promise<void> {
    const guardians = await guardianService.getAllGuardians();
    sendSuccess(response, 200, "Guardians fetched successfully.", guardians);
  },

  async createGuardian(request: Request, response: Response): Promise<void> {
    const payload = parseCreateGuardianDto(request.body);
    const guardian = await guardianService.createGuardian(payload);
    sendSuccess(response, 201, "Guardian created successfully.", guardian);
  },

  async getGuardianById(request: Request, response: Response): Promise<void> {
    const guardianId = parseGuardianIdParam(request.params.id);
    const guardian = await guardianService.getGuardianById(guardianId);
    sendSuccess(response, 200, "Guardian fetched successfully.", guardian);
  },

  async updateGuardian(request: Request, response: Response): Promise<void> {
    const guardianId = parseGuardianIdParam(request.params.id);
    const payload = parseUpdateGuardianDto(request.body);
    const guardian = await guardianService.updateGuardian(guardianId, payload);
    sendSuccess(response, 200, "Guardian updated successfully.", guardian);
  },

  async deleteGuardian(request: Request, response: Response): Promise<void> {
    const guardianId = parseGuardianIdParam(request.params.id);
    await guardianService.deleteGuardian(guardianId);
    sendSuccess(response, 200, "Guardian soft deleted successfully.");
  },
};
