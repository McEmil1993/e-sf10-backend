import type { RowDataPacket } from "mysql2";
import type {
  GuardianRecord,
  GuardianResponseDto,
} from "../guardian/guardian.interface";

export interface PupilBaseFields {
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

export interface PupilRecord extends PupilBaseFields {
  id: number;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePupilInput extends PupilBaseFields {}

export interface UpdatePupilInput extends PupilBaseFields {}

export interface CreatePupilDto extends PupilBaseFields {}

export interface UpdatePupilDto {
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

export interface PupilResponseDto extends PupilBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PupilGuardianBaseFields {
  relationship: string;
  isPrimary: boolean;
  guardianId?: number | null;
}

export interface CreatePupilGuardianInput extends PupilGuardianBaseFields {
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

export interface CreatePupilGuardianDto extends PupilGuardianBaseFields {
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

export interface UpdatePupilGuardianInput extends PupilGuardianBaseFields {}

export interface UpdatePupilGuardianDto {
  relationship?: string;
  isPrimary?: boolean;
}

export interface PupilGuardianRecord extends PupilGuardianBaseFields {
  id: number;
  pupilId: number;
  guardianId: number;
  guardian: GuardianRecord;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PupilGuardianResponseDto extends PupilGuardianBaseFields {
  id: number;
  pupilId: number;
  guardianId: number;
  guardian: GuardianResponseDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PupilRow extends RowDataPacket {
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

export interface PupilGuardianRow extends RowDataPacket {
  id: number;
  pupilId: number;
  guardianId: number;
  relationship: string;
  isPrimary: number | boolean;
  guardianFirstName: string;
  guardianMiddleName: string | null;
  guardianLastName: string;
  guardianSuffix: string | null;
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
