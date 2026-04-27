import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreatePositionDto,
  parsePositionIdParam,
  parseUpdatePositionDto,
} from "./position.dto";
import { positionService } from "./position.service";

export const positionController = {
  async getAllPositions(_request: Request, response: Response): Promise<void> {
    const positions = await positionService.getAllPositions();
    sendSuccess(response, 200, "Positions fetched successfully.", positions);
  },

  async createPosition(request: Request, response: Response): Promise<void> {
    const payload = parseCreatePositionDto(request.body);
    const position = await positionService.createPosition(payload);
    sendSuccess(response, 201, "Position created successfully.", position);
  },

  async getPositionById(request: Request, response: Response): Promise<void> {
    const positionId = parsePositionIdParam(request.params.id);
    const position = await positionService.getPositionById(positionId);
    sendSuccess(response, 200, "Position fetched successfully.", position);
  },

  async updatePosition(request: Request, response: Response): Promise<void> {
    const positionId = parsePositionIdParam(request.params.id);
    const payload = parseUpdatePositionDto(request.body);
    const position = await positionService.updatePosition(positionId, payload);
    sendSuccess(response, 200, "Position updated successfully.", position);
  },

  async deletePosition(request: Request, response: Response): Promise<void> {
    const positionId = parsePositionIdParam(request.params.id);
    await positionService.deletePosition(positionId);
    sendSuccess(response, 200, "Position soft deleted successfully.");
  },
};
