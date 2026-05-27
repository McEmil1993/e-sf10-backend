import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { parseUpdateSchoolDto } from "./system.dto";
import { systemService } from "./system.service";

export const systemController = {
  async getSchool(_request: Request, response: Response): Promise<void> {
    const school = await systemService.getSchool();
    sendSuccess(response, 200, "School settings fetched successfully.", school);
  },

  async updateSchool(request: Request, response: Response): Promise<void> {
    const payload = parseUpdateSchoolDto(request.body);
    const school = await systemService.updateSchool(payload);
    sendSuccess(response, 200, "School settings updated successfully.", school);
  },
};
