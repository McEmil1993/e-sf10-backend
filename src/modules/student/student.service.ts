import { HttpError } from "../../common/utils/http-error";
import { guardianRepository } from "../guardian/guardian.repository";
import {
  toStudentGuardianResponseDto,
  toStudentInformationLookupsResponseDto,
  toStudentInformationResponseDto,
  toStudentResponseDto,
} from "./student.dto";
import type {
  CreateStudentGuardianDto,
  CreateStudentGuardianInput,
  CreateStudentDto,
  CreateStudentInput,
  StudentInformationLookupType,
  StudentRecord,
  UpdateStudentGuardianDto,
  UpdateStudentGuardianInput,
  UpdateStudentInformationDto,
  UpdateStudentDto,
  UpdateStudentInput,
} from "./student.interface";
import { studentRepository } from "./student.repository";

const ensureLrnIsAvailable = async (lrn: string, currentStudentId?: number): Promise<void> => {
  const existingStudent = await studentRepository.findByLrnIncludingDeleted(lrn);

  if (existingStudent && existingStudent.id !== currentStudentId) {
    throw new HttpError(409, "LRN is already in use.");
  }
};

const buildCreateStudentInput = async (payload: CreateStudentDto): Promise<CreateStudentInput> => {
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

const buildUpdateStudentInput = async (
  currentStudent: StudentRecord,
  payload: UpdateStudentDto,
): Promise<UpdateStudentInput> => {
  const lrn = payload.lrn ?? currentStudent.lrn;

  await ensureLrnIsAvailable(lrn, currentStudent.id);

  return {
    lrn,
    firstName: payload.firstName ?? currentStudent.firstName,
    middleName: payload.middleName === undefined ? currentStudent.middleName : payload.middleName,
    lastName: payload.lastName ?? currentStudent.lastName,
    suffix: payload.suffix === undefined ? currentStudent.suffix : payload.suffix,
    sex: payload.sex ?? currentStudent.sex,
    birthdate: payload.birthdate ?? currentStudent.birthdate,
    birthplace: payload.birthplace === undefined ? currentStudent.birthplace : payload.birthplace,
    streetAddress:
      payload.streetAddress === undefined ? currentStudent.streetAddress : payload.streetAddress,
    barangay: payload.barangay ?? currentStudent.barangay,
    cityMunicipality: payload.cityMunicipality ?? currentStudent.cityMunicipality,
    province: payload.province ?? currentStudent.province,
    region: payload.region ?? currentStudent.region,
    status: payload.status ?? currentStudent.status,
    profilePicture: payload.profilePicture === undefined ? currentStudent.profilePicture : payload.profilePicture,
  };
};

const buildCreateStudentGuardianInput = async (
  payload: CreateStudentGuardianDto,
): Promise<CreateStudentGuardianInput> => {
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

const buildUpdateStudentGuardianInput = async (
  currentRelation: { relationship: string; isPrimary: boolean },
  payload: UpdateStudentGuardianDto,
): Promise<UpdateStudentGuardianInput> => ({
  relationship: payload.relationship ?? currentRelation.relationship,
  isPrimary: payload.isPrimary ?? currentRelation.isPrimary,
});

const getLookupIdFromPayload = async (
  type: StudentInformationLookupType,
  payload: {
    id?: number | null | undefined;
    name?: string | null | undefined;
  },
): Promise<number | null | undefined> => {
  if (payload.id !== undefined) {
    if (payload.id === null) {
      return null;
    }

    const lookup = await studentRepository.findInformationLookupById(type, payload.id);

    if (!lookup) {
      throw new HttpError(404, "Selected lookup value was not found.");
    }

    return lookup.id;
  }

  if (payload.name !== undefined) {
    if (!payload.name) {
      return null;
    }

    const lookup = await studentRepository.findInformationLookupByName(type, payload.name);

    if (!lookup) {
      throw new HttpError(404, "Selected lookup value was not found.");
    }

    return lookup.id;
  }

  return undefined;
};

const buildUpdateStudentInformationInput = async (
  payload: UpdateStudentInformationDto,
): Promise<{
  motherTongueId?: number | null;
  indigenousGroupId?: number | null;
  religionId?: number | null;
}> => {
  const motherTongueId = await getLookupIdFromPayload("motherTongue", {
    id: payload.motherTongueId,
    name: payload.motherTongue,
  });

  let indigenousGroupId = await getLookupIdFromPayload("indigenousGroup", {
    id: payload.indigenousGroupId,
    name: payload.indigenousGroup,
  });

  if (payload.indigenousGroupOther !== undefined) {
    if (!payload.indigenousGroupOther) {
      indigenousGroupId = null;
    } else {
      const customGroup = await studentRepository.findOrCreateIndigenousGroup(payload.indigenousGroupOther);
      indigenousGroupId = customGroup.id;
    }
  }

  const religionId = await getLookupIdFromPayload("religion", {
    id: payload.religionId,
    name: payload.religion,
  });

  return {
    ...(motherTongueId !== undefined ? { motherTongueId } : {}),
    ...(indigenousGroupId !== undefined ? { indigenousGroupId } : {}),
    ...(religionId !== undefined ? { religionId } : {}),
  };
};

export const studentService = {
  async getStudentInformationLookups() {
    const lookups = await studentRepository.getStudentInformationLookups();
    return toStudentInformationLookupsResponseDto(lookups);
  },

  async getAllStudents() {
    const students = await studentRepository.findAll();
    return students.map(toStudentResponseDto);
  },

  async getStudentById(studentId: number) {
    const student = await studentRepository.findById(studentId);

    if (!student) {
      throw new HttpError(404, "Student not found.");
    }

    return toStudentResponseDto(student);
  },

  async createStudent(payload: CreateStudentDto) {
    const createStudentInput = await buildCreateStudentInput(payload);
    const student = await studentRepository.createStudent(createStudentInput);
    return toStudentResponseDto(student);
  },

  async updateStudent(studentId: number, payload: UpdateStudentDto) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const updateStudentInput = await buildUpdateStudentInput(currentStudent, payload);
    const updatedStudent = await studentRepository.updateStudent(studentId, updateStudentInput);
    return toStudentResponseDto(updatedStudent);
  },

  async deleteStudent(studentId: number) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    await studentRepository.softDeleteStudent(studentId);
  },

  async getStudentInformation(studentId: number) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const information = await studentRepository.getStudentInformation(studentId);
    return toStudentInformationResponseDto(information);
  },

  async updateStudentInformation(studentId: number, payload: UpdateStudentInformationDto) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const updateInput = await buildUpdateStudentInformationInput(payload);
    const information = await studentRepository.updateStudentInformation(studentId, updateInput);
    return toStudentInformationResponseDto(information);
  },

  async getStudentGuardians(studentId: number) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const relations = await studentRepository.findGuardianRelationsByStudentId(studentId);
    return relations.map(toStudentGuardianResponseDto);
  },

  async createStudentGuardian(studentId: number, payload: CreateStudentGuardianDto) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const createStudentGuardianInput = await buildCreateStudentGuardianInput(payload);

    if (createStudentGuardianInput.guardianId) {
      const guardian = await guardianRepository.findById(createStudentGuardianInput.guardianId);

      if (!guardian) {
        throw new HttpError(404, "Guardian not found.");
      }

      const existingRelation = await studentRepository.findGuardianRelationByStudentAndGuardianId(
        studentId,
        createStudentGuardianInput.guardianId,
      );

      if (existingRelation) {
        throw new HttpError(409, "Guardian is already linked to this student.");
      }
    }

    const relation = await studentRepository.createGuardianRelation(
      studentId,
      createStudentGuardianInput,
    );

    return toStudentGuardianResponseDto(relation);
  },

  async updateStudentGuardian(studentId: number, relationId: number, payload: UpdateStudentGuardianDto) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const currentRelation = await studentRepository.findGuardianRelationById(relationId);

    if (!currentRelation || currentRelation.studentId !== studentId) {
      throw new HttpError(404, "Student guardian relation not found.");
    }

    const updateStudentGuardianInput = await buildUpdateStudentGuardianInput(currentRelation, payload);
    const updatedRelation = await studentRepository.updateGuardianRelation(
      studentId,
      relationId,
      updateStudentGuardianInput,
    );

    return toStudentGuardianResponseDto(updatedRelation);
  },

  async deleteStudentGuardian(studentId: number, relationId: number) {
    const currentStudent = await studentRepository.findById(studentId);

    if (!currentStudent) {
      throw new HttpError(404, "Student not found.");
    }

    const currentRelation = await studentRepository.findGuardianRelationById(relationId);

    if (!currentRelation || currentRelation.studentId !== studentId) {
      throw new HttpError(404, "Student guardian relation not found.");
    }

    await studentRepository.softDeleteGuardianRelation(studentId, relationId);
  },
};
