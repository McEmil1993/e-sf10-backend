import { HttpError } from "../../common/utils/http-error";
import { toPupilResponseDto } from "./pupil.dto";
import type {
  CreatePupilDto,
  CreatePupilInput,
  PupilRecord,
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
  };
};

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
};
