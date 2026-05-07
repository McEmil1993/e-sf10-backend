import { HttpError } from "../../common/utils/http-error";
import { guardianRepository } from "../guardian/guardian.repository";
import { toPupilGuardianResponseDto, toPupilResponseDto } from "./pupil.dto";
import type {
  CreatePupilGuardianDto,
  CreatePupilGuardianInput,
  CreatePupilDto,
  CreatePupilInput,
  PupilRecord,
  UpdatePupilGuardianDto,
  UpdatePupilGuardianInput,
  UpdatePupilDto,
  UpdatePupilInput,
} from "./pupil.interface";
import { pupilRepository } from "./pupil.repository";

const ensureLrnIsAvailable = async (lrn: string, currentPupilId?: number): Promise<void> => {
  const existingPupil = await pupilRepository.findByLrnIncludingDeleted(lrn);

  if (existingPupil && existingPupil.id !== currentPupilId) {
    throw new HttpError(409, "LRN is already in use.");
  }
};

const buildCreatePupilInput = async (payload: CreatePupilDto): Promise<CreatePupilInput> => {
  await ensureLrnIsAvailable(payload.lrn);

  return {
    lrn: payload.lrn,
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    suffix: payload.suffix,
    sex: payload.sex,
    birthdate: payload.birthdate,
    birthplace: payload.birthplace,
    streetAddress: payload.streetAddress,
    barangay: payload.barangay,
    cityMunicipality: payload.cityMunicipality,
    province: payload.province,
    region: payload.region,
    status: payload.status,
    profilePicture: payload.profilePicture,
  };
};

const buildUpdatePupilInput = async (
  currentPupil: PupilRecord,
  payload: UpdatePupilDto,
): Promise<UpdatePupilInput> => {
  const lrn = payload.lrn ?? currentPupil.lrn;

  await ensureLrnIsAvailable(lrn, currentPupil.id);

  return {
    lrn,
    firstName: payload.firstName ?? currentPupil.firstName,
    middleName: payload.middleName === undefined ? currentPupil.middleName : payload.middleName,
    lastName: payload.lastName ?? currentPupil.lastName,
    suffix: payload.suffix === undefined ? currentPupil.suffix : payload.suffix,
    sex: payload.sex ?? currentPupil.sex,
    birthdate: payload.birthdate ?? currentPupil.birthdate,
    birthplace: payload.birthplace === undefined ? currentPupil.birthplace : payload.birthplace,
    streetAddress:
      payload.streetAddress === undefined ? currentPupil.streetAddress : payload.streetAddress,
    barangay: payload.barangay ?? currentPupil.barangay,
    cityMunicipality: payload.cityMunicipality ?? currentPupil.cityMunicipality,
    province: payload.province ?? currentPupil.province,
    region: payload.region ?? currentPupil.region,
    status: payload.status ?? currentPupil.status,
    profilePicture: payload.profilePicture === undefined ? currentPupil.profilePicture : payload.profilePicture,
  };
};

const buildCreatePupilGuardianInput = async (
  payload: CreatePupilGuardianDto,
): Promise<CreatePupilGuardianInput> => {
  if (payload.guardianId) {
    return {
      guardianId: payload.guardianId,
      relationship: payload.relationship,
      isPrimary: payload.isPrimary,
    };
  }

  return {
    guardianId: null,
    relationship: payload.relationship,
    isPrimary: payload.isPrimary,
    ...(payload.firstName !== undefined ? { firstName: payload.firstName } : {}),
    ...(payload.middleName !== undefined ? { middleName: payload.middleName } : {}),
    ...(payload.lastName !== undefined ? { lastName: payload.lastName } : {}),
    ...(payload.suffix !== undefined ? { suffix: payload.suffix } : {}),
    ...(payload.contactNumber !== undefined ? { contactNumber: payload.contactNumber } : {}),
    ...(payload.address !== undefined ? { address: payload.address } : {}),
    ...(payload.barangay !== undefined ? { barangay: payload.barangay } : {}),
    ...(payload.municipalityCity !== undefined ? { municipalityCity: payload.municipalityCity } : {}),
    ...(payload.province !== undefined ? { province: payload.province } : {}),
    ...(payload.region !== undefined ? { region: payload.region } : {}),
    ...(payload.profilePicture !== undefined ? { profilePicture: payload.profilePicture } : {}),
  };
};

const buildUpdatePupilGuardianInput = async (
  currentRelation: { relationship: string; isPrimary: boolean },
  payload: UpdatePupilGuardianDto,
): Promise<UpdatePupilGuardianInput> => ({
  relationship: payload.relationship ?? currentRelation.relationship,
  isPrimary: payload.isPrimary ?? currentRelation.isPrimary,
});

export const pupilService = {
  async getAllPupils() {
    const pupils = await pupilRepository.findAll();
    return pupils.map(toPupilResponseDto);
  },

  async getPupilById(pupilId: number) {
    const pupil = await pupilRepository.findById(pupilId);

    if (!pupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    return toPupilResponseDto(pupil);
  },

  async createPupil(payload: CreatePupilDto) {
    const createPupilInput = await buildCreatePupilInput(payload);
    const pupil = await pupilRepository.createPupil(createPupilInput);
    return toPupilResponseDto(pupil);
  },

  async updatePupil(pupilId: number, payload: UpdatePupilDto) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    const updatePupilInput = await buildUpdatePupilInput(currentPupil, payload);
    const updatedPupil = await pupilRepository.updatePupil(pupilId, updatePupilInput);
    return toPupilResponseDto(updatedPupil);
  },

  async deletePupil(pupilId: number) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    await pupilRepository.softDeletePupil(pupilId);
  },

  async getPupilGuardians(pupilId: number) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    const relations = await pupilRepository.findGuardianRelationsByPupilId(pupilId);
    return relations.map(toPupilGuardianResponseDto);
  },

  async createPupilGuardian(pupilId: number, payload: CreatePupilGuardianDto) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    const createPupilGuardianInput = await buildCreatePupilGuardianInput(payload);

    if (createPupilGuardianInput.guardianId) {
      const guardian = await guardianRepository.findById(createPupilGuardianInput.guardianId);

      if (!guardian) {
        throw new HttpError(404, "Guardian not found.");
      }

      const existingRelation = await pupilRepository.findGuardianRelationByPupilAndGuardianId(
        pupilId,
        createPupilGuardianInput.guardianId,
      );

      if (existingRelation) {
        throw new HttpError(409, "Guardian is already linked to this pupil.");
      }
    }

    const relation = await pupilRepository.createGuardianRelation(
      pupilId,
      createPupilGuardianInput,
    );

    return toPupilGuardianResponseDto(relation);
  },

  async updatePupilGuardian(pupilId: number, relationId: number, payload: UpdatePupilGuardianDto) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    const currentRelation = await pupilRepository.findGuardianRelationById(relationId);

    if (!currentRelation || currentRelation.pupilId !== pupilId) {
      throw new HttpError(404, "Pupil guardian relation not found.");
    }

    const updatePupilGuardianInput = await buildUpdatePupilGuardianInput(currentRelation, payload);
    const updatedRelation = await pupilRepository.updateGuardianRelation(
      pupilId,
      relationId,
      updatePupilGuardianInput,
    );

    return toPupilGuardianResponseDto(updatedRelation);
  },

  async deletePupilGuardian(pupilId: number, relationId: number) {
    const currentPupil = await pupilRepository.findById(pupilId);

    if (!currentPupil) {
      throw new HttpError(404, "Pupil not found.");
    }

    const currentRelation = await pupilRepository.findGuardianRelationById(relationId);

    if (!currentRelation || currentRelation.pupilId !== pupilId) {
      throw new HttpError(404, "Pupil guardian relation not found.");
    }

    await pupilRepository.softDeleteGuardianRelation(pupilId, relationId);
  },
};
