import { HttpError } from "../../common/utils/http-error";
import type { CreatePositionDto, UpdatePositionDto } from "./position.interface";
import { positionRepository } from "./position.repository";
import { toPositionResponseDto } from "./position.dto";

export const positionService = {
  async getAllPositions() {
    const positions = await positionRepository.findAll();
    return positions.map(toPositionResponseDto);
  },

  async getPositionById(positionId: number) {
    const position = await positionRepository.findById(positionId);

    if (!position) {
      throw new HttpError(404, "Position not found.");
    }

    return toPositionResponseDto(position);
  },

  async createPosition(payload: CreatePositionDto) {
    const position = await positionRepository.createPosition(payload);
    return toPositionResponseDto(position);
  },

  async updatePosition(positionId: number, payload: UpdatePositionDto) {
    const currentPosition = await positionRepository.findById(positionId);

    if (!currentPosition) {
      throw new HttpError(404, "Position not found.");
    }

    const updatedPosition = await positionRepository.updatePosition(positionId, {
      acronym: payload.acronym ?? currentPosition.acronym,
      fullPosition: payload.fullPosition ?? currentPosition.fullPosition,
      category: payload.category ?? currentPosition.category,
    });

    return toPositionResponseDto(updatedPosition);
  },

  async deletePosition(positionId: number) {
    const currentPosition = await positionRepository.findById(positionId);

    if (!currentPosition) {
      throw new HttpError(404, "Position not found.");
    }

    await positionRepository.softDeletePosition(positionId);
  },
};
