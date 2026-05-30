import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { academicEntityDefinitions } from "./academic.definitions";
import {
  parseAcademicEntityKey,
  parseAcademicIdParam,
  parseCreateAcademicDto,
  parseUpdateAcademicDto,
} from "./academic.dto";
import { academicService } from "./academic.service";

const getDefinition = (request: Request) => {
  const key = parseAcademicEntityKey(request.params.entity);
  return academicEntityDefinitions[key];
};

export const academicController = {
  async list(request: Request, response: Response): Promise<void> {
    const definition = getDefinition(request);
    const records = await academicService.list(definition);
    sendSuccess(response, 200, `${definition.label}s fetched successfully.`, records);
  },

  async create(request: Request, response: Response): Promise<void> {
    const definition = getDefinition(request);
    const payload = parseCreateAcademicDto(definition, request.body);
    const record = await academicService.create(definition, payload);
    sendSuccess(response, 201, `${definition.label} created successfully.`, record);
  },

  async getById(request: Request, response: Response): Promise<void> {
    const definition = getDefinition(request);
    const recordId = parseAcademicIdParam(request.params.id);
    const record = await academicService.getById(definition, recordId);
    sendSuccess(response, 200, `${definition.label} fetched successfully.`, record);
  },

  async update(request: Request, response: Response): Promise<void> {
    const definition = getDefinition(request);
    const recordId = parseAcademicIdParam(request.params.id);
    const payload = parseUpdateAcademicDto(definition, request.body);
    const record = await academicService.update(definition, recordId, payload);
    sendSuccess(response, 200, `${definition.label} updated successfully.`, record);
  },

  async delete(request: Request, response: Response): Promise<void> {
    const definition = getDefinition(request);
    const recordId = parseAcademicIdParam(request.params.id);
    await academicService.delete(definition, recordId);
    sendSuccess(response, 200, `${definition.label} soft deleted successfully.`);
  },
};
