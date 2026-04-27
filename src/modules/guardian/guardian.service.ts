import { HttpError } from "../../common/utils/http-error";
import { toGuardianResponseDto } from "./guardian.dto";
import type {
  CreateGuardianDto,
  CreateGuardianInput,
  GuardianRecord,
  UpdateGuardianDto,
  UpdateGuardianInput,
} from "./guardian.interface";
import { guardianRepository } from "./guardian.repository";

const buildCreateGuardianInput = async (payload: CreateGuardianDto): Promise<CreateGuardianInput> => {
  return {
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    suffix: payload.suffix,
    contactNumber: payload.contactNumber,
    address: payload.address,
    barangay: payload.barangay,
    municipalityCity: payload.municipalityCity,
    province: payload.province,
    region: payload.region,
    profilePicture: payload.profilePicture,
  };
};

const buildUpdateGuardianInput = async (
  currentGuardian: GuardianRecord,
  payload: UpdateGuardianDto,
): Promise<UpdateGuardianInput> => {
  return {
    firstName: payload.firstName ?? currentGuardian.firstName,
    middleName: payload.middleName === undefined ? currentGuardian.middleName : payload.middleName,
    lastName: payload.lastName ?? currentGuardian.lastName,
    suffix: payload.suffix === undefined ? currentGuardian.suffix : payload.suffix,
    contactNumber: payload.contactNumber ?? currentGuardian.contactNumber,
    address: payload.address ?? currentGuardian.address,
    barangay: payload.barangay ?? currentGuardian.barangay,
    municipalityCity: payload.municipalityCity ?? currentGuardian.municipalityCity,
    province: payload.province ?? currentGuardian.province,
    region: payload.region ?? currentGuardian.region,
    profilePicture: payload.profilePicture === undefined ? currentGuardian.profilePicture : payload.profilePicture,
  };
};

export const guardianService = {
  async getAllGuardians() {
    const guardians = await guardianRepository.findAll();
    return guardians.map(toGuardianResponseDto);
  },

  async getGuardianById(guardianId: number) {
    const guardian = await guardianRepository.findById(guardianId);

    if (!guardian) {
      throw new HttpError(404, "Guardian not found.");
    }

    return toGuardianResponseDto(guardian);
  },

  async createGuardian(payload: CreateGuardianDto) {
    const createGuardianInput = await buildCreateGuardianInput(payload);
    const guardian = await guardianRepository.createGuardian(createGuardianInput);
    return toGuardianResponseDto(guardian);
  },

  async updateGuardian(guardianId: number, payload: UpdateGuardianDto) {
    const currentGuardian = await guardianRepository.findById(guardianId);

    if (!currentGuardian) {
      throw new HttpError(404, "Guardian not found.");
    }

    const updateGuardianInput = await buildUpdateGuardianInput(currentGuardian, payload);
    const updatedGuardian = await guardianRepository.updateGuardian(guardianId, updateGuardianInput);
    return toGuardianResponseDto(updatedGuardian);
  },

  async deleteGuardian(guardianId: number) {
    const currentGuardian = await guardianRepository.findById(guardianId);

    if (!currentGuardian) {
      throw new HttpError(404, "Guardian not found.");
    }

    await guardianRepository.softDeleteGuardian(guardianId);
  },
};
