import { HttpError } from "../../common/utils/http-error";
import { toSubjectResponseDto } from "./subject.dto";
import type {
  CreateSubjectDto,
  CreateSubjectInput,
  SubjectRecord,
  UpdateSubjectDto,
  UpdateSubjectInput,
} from "./subject.interface";
import { subjectRepository } from "./subject.repository";

const buildCreateSubjectInput = (payload: CreateSubjectDto): CreateSubjectInput => {
  return {
    name: payload.name,
    subjectGroup: payload.subjectGroup,
    gradeLevels: payload.gradeLevels,
    isOptional: payload.isOptional,
    sortOrder: payload.sortOrder,
    isActive: payload.isActive,
  };
};

const buildUpdateSubjectInput = (
  currentSubject: SubjectRecord,
  payload: UpdateSubjectDto,
): UpdateSubjectInput => {
  return {
    name: payload.name ?? currentSubject.name,
    subjectGroup: payload.subjectGroup === undefined ? currentSubject.subjectGroup : payload.subjectGroup,
    gradeLevels: payload.gradeLevels ?? currentSubject.gradeLevels,
    isOptional: payload.isOptional ?? currentSubject.isOptional,
    sortOrder: payload.sortOrder ?? currentSubject.sortOrder,
    isActive: payload.isActive ?? currentSubject.isActive,
  };
};

export const subjectService = {
  async getAllSubjects() {
    const subjects = await subjectRepository.findAll();
    return subjects.map(toSubjectResponseDto);
  },

  async getSubjectById(subjectId: number) {
    const subject = await subjectRepository.findById(subjectId);

    if (!subject) {
      throw new HttpError(404, "Subject not found.");
    }

    return toSubjectResponseDto(subject);
  },

  async createSubject(payload: CreateSubjectDto) {
    const subject = await subjectRepository.createSubject(buildCreateSubjectInput(payload));
    return toSubjectResponseDto(subject);
  },

  async updateSubject(subjectId: number, payload: UpdateSubjectDto) {
    const currentSubject = await subjectRepository.findById(subjectId);

    if (!currentSubject) {
      throw new HttpError(404, "Subject not found.");
    }

    const subject = await subjectRepository.updateSubject(
      subjectId,
      buildUpdateSubjectInput(currentSubject, payload),
    );

    return toSubjectResponseDto(subject);
  },

  async deleteSubject(subjectId: number) {
    const currentSubject = await subjectRepository.findById(subjectId);

    if (!currentSubject) {
      throw new HttpError(404, "Subject not found.");
    }

    await subjectRepository.softDeleteSubject(subjectId);
  },
};
