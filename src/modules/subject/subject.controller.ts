import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreateSubjectDto,
  parseSubjectIdParam,
  parseUpdateSubjectDto,
} from "./subject.dto";
import { subjectService } from "./subject.service";

export const subjectController = {
  async getAllSubjects(_request: Request, response: Response): Promise<void> {
    const subjects = await subjectService.getAllSubjects();
    sendSuccess(response, 200, "Subjects fetched successfully.", subjects);
  },

  async createSubject(request: Request, response: Response): Promise<void> {
    const payload = parseCreateSubjectDto(request.body);
    const subject = await subjectService.createSubject(payload);
    sendSuccess(response, 201, "Subject created successfully.", subject);
  },

  async getSubjectById(request: Request, response: Response): Promise<void> {
    const subjectId = parseSubjectIdParam(request.params.id);
    const subject = await subjectService.getSubjectById(subjectId);
    sendSuccess(response, 200, "Subject fetched successfully.", subject);
  },

  async updateSubject(request: Request, response: Response): Promise<void> {
    const subjectId = parseSubjectIdParam(request.params.id);
    const payload = parseUpdateSubjectDto(request.body);
    const subject = await subjectService.updateSubject(subjectId, payload);
    sendSuccess(response, 200, "Subject updated successfully.", subject);
  },

  async deleteSubject(request: Request, response: Response): Promise<void> {
    const subjectId = parseSubjectIdParam(request.params.id);
    await subjectService.deleteSubject(subjectId);
    sendSuccess(response, 200, "Subject soft deleted successfully.");
  },
};
