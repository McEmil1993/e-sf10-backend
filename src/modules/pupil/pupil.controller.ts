import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreatePupilDto,
  parsePupilIdParam,
  parseUpdatePupilDto,
} from "./pupil.dto";
import { pupilService } from "./pupil.service";

export const pupilController = {
  async getAllPupils(_request: Request, response: Response): Promise<void> {
    const pupils = await pupilService.getAllPupils();
    sendSuccess(response, 200, "Pupils fetched successfully.", pupils);
  },

  async createPupil(request: Request, response: Response): Promise<void> {
    const payload = parseCreatePupilDto(request.body);
    const pupil = await pupilService.createPupil(payload);
    sendSuccess(response, 201, "Pupil created successfully.", pupil);
  },

  async getPupilById(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const pupil = await pupilService.getPupilById(pupilId);
    sendSuccess(response, 200, "Pupil fetched successfully.", pupil);
  },

  async updatePupil(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const payload = parseUpdatePupilDto(request.body);
    const pupil = await pupilService.updatePupil(pupilId, payload);
    sendSuccess(response, 200, "Pupil updated successfully.", pupil);
  },

  async deletePupil(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    await pupilService.deletePupil(pupilId);
    sendSuccess(response, 200, "Pupil soft deleted successfully.");
  },
};
