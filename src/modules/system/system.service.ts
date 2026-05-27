import { HttpError } from "../../common/utils/http-error";
import { toSchoolResponseDto } from "./system.dto";
import type { UpdateSchoolDto } from "./system.interface";
import { systemRepository } from "./system.repository";

export const systemService = {
  async getSchool() {
    const school = await systemRepository.getSchool();

    if (!school) {
      throw new HttpError(404, "School settings not found.");
    }

    return toSchoolResponseDto(school);
  },

  async updateSchool(payload: UpdateSchoolDto) {
    const currentSchool = await systemRepository.getSchool();

    if (!currentSchool) {
      throw new HttpError(404, "School settings not found.");
    }

    const updatedSchool = await systemRepository.updateSchool(currentSchool.schoolId, {
      depedSchoolId: payload.depedSchoolId ?? currentSchool.depedSchoolId,
      schoolName: payload.schoolName ?? currentSchool.schoolName,
      district: payload.district ?? currentSchool.district,
      division: payload.division ?? currentSchool.division,
      region: payload.region ?? currentSchool.region,
      address: payload.address ?? currentSchool.address,
      schoolLogo: payload.schoolLogo === undefined ? currentSchool.schoolLogo : payload.schoolLogo,
      depedLogo: payload.depedLogo === undefined ? currentSchool.depedLogo : payload.depedLogo,
      otherLogo: payload.otherLogo === undefined ? currentSchool.otherLogo : payload.otherLogo,
    });

    return toSchoolResponseDto(updatedSchool);
  },
};
