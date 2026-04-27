import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreatePupilGuardianDto,
  parseCreatePupilDto,
  parsePupilIdParam,
  parseUpdatePupilGuardianDto,
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

  async getPupilGuardians(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const guardians = await pupilService.getPupilGuardians(pupilId);
    sendSuccess(response, 200, "Pupil guardians fetched successfully.", guardians);
  },

  async createPupilGuardian(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const payload = parseCreatePupilGuardianDto(request.body);
    const relation = await pupilService.createPupilGuardian(pupilId, payload);
    sendSuccess(response, 201, "Pupil guardian created successfully.", relation);
  },

  async updatePupilGuardian(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const relationId = parsePupilIdParam(request.params.relationId, "relationId");
    const payload = parseUpdatePupilGuardianDto(request.body);
    const relation = await pupilService.updatePupilGuardian(pupilId, relationId, payload);
    sendSuccess(response, 200, "Pupil guardian updated successfully.", relation);
  },

  async deletePupilGuardian(request: Request, response: Response): Promise<void> {
    const pupilId = parsePupilIdParam(request.params.id);
    const relationId = parsePupilIdParam(request.params.relationId, "relationId");
    await pupilService.deletePupilGuardian(pupilId, relationId);
    sendSuccess(response, 200, "Pupil guardian removed successfully.");
  },
};
