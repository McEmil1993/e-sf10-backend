import type { RowDataPacket } from "mysql2";
import type {
  GuardianRecord,
  GuardianResponseDto,
} from "../guardian/guardian.interface";

export interface StudentBaseFields {
  lrn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  sex: "male" | "female";
  birthdate: string;
  birthplace: string | null;
  streetAddress: string | null;
  barangay: string;
  cityMunicipality: string;
  province: string;
  region: string;
  status: "active" | "inactive" | "transferred" | "graduated";
  profilePicture: string | null;
}

export interface StudentRecord extends StudentBaseFields {
  id: number;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateStudentInput extends StudentBaseFields {}

export interface UpdateStudentInput extends StudentBaseFields {}

export interface CreateStudentDto extends StudentBaseFields {}

export interface UpdateStudentDto {
  lrn?: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  sex?: "male" | "female";
  birthdate?: string;
  birthplace?: string | null;
  streetAddress?: string | null;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
  region?: string;
  status?: "active" | "inactive" | "transferred" | "graduated";
  profilePicture?: string | null;
}

export interface StudentResponseDto extends StudentBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type StudentInformationLookupType = "motherTongue" | "indigenousGroup" | "religion";

export interface StudentInformationLookupRecord {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface StudentInformationLookupsResponseDto {
  motherTongues: StudentInformationLookupRecord[];
  indigenousGroups: StudentInformationLookupRecord[];
  religions: StudentInformationLookupRecord[];
}

export interface StudentInformationRecord {
  studentId: number;
  motherTongue: StudentInformationLookupRecord | null;
  indigenousGroup: StudentInformationLookupRecord | null;
  religion: StudentInformationLookupRecord | null;
}

export interface UpdateStudentInformationDto {
  motherTongueId?: number | null;
  motherTongue?: string | null;
  indigenousGroupId?: number | null;
  indigenousGroup?: string | null;
  indigenousGroupOther?: string | null;
  religionId?: number | null;
  religion?: string | null;
}

export interface StudentInformationLookupRow extends RowDataPacket {
  id: number;
  name: string;
  sortOrder: number;
  isActive: number | boolean;
}

export interface StudentGuardianBaseFields {
  relationship: string;
  isPrimary: boolean;
  guardianId?: number | null;
}

export interface CreateStudentGuardianInput extends StudentGuardianBaseFields {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  contactNumber?: string;
  address?: string;
  barangay?: string;
  municipalityCity?: string;
  province?: string;
  region?: string;
  profilePicture?: string | null;
}

export interface CreateStudentGuardianDto extends StudentGuardianBaseFields {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  contactNumber?: string;
  address?: string;
  barangay?: string;
  municipalityCity?: string;
  province?: string;
  region?: string;
  profilePicture?: string | null;
}

export interface UpdateStudentGuardianInput extends StudentGuardianBaseFields {}

export interface UpdateStudentGuardianDto {
  relationship?: string;
  isPrimary?: boolean;
}

export interface StudentGuardianRecord extends StudentGuardianBaseFields {
  id: number;
  studentId: number;
  guardianId: number;
  guardian: GuardianRecord;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StudentGuardianResponseDto extends StudentGuardianBaseFields {
  id: number;
  studentId: number;
  guardianId: number;
  guardian: GuardianResponseDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StudentRow extends RowDataPacket {
  id: number;
  lrn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  sex: "male" | "female";
  birthdate: Date | string;
  birthplace: string | null;
  streetAddress: string | null;
  barangay: string;
  cityMunicipality: string;
  province: string;
  region: string;
  status: "active" | "inactive" | "transferred" | "graduated";
  profilePicture: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface StudentGuardianRow extends RowDataPacket {
  id: number;
  studentId: number;
  guardianId: number;
  relationship: string;
  isPrimary: number | boolean;
  guardianFirstName: string;
  guardianMiddleName: string | null;
  guardianLastName: string;
  guardianSuffix: string | null;
  guardianRelationship: string;
  guardianContactNumber: string;
  guardianAddress: string;
  guardianBarangay: string;
  guardianMunicipalityCity: string;
  guardianProvince: string;
  guardianRegion: string;
  guardianProfilePicture: string | null;
  guardianCreatedAt: Date | string;
  guardianUpdatedAt: Date | string;
  guardianDeletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
