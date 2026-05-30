export const backupTableNames = [
  "modules",
  "permissions",
  "roles",
  "role_permissions",
  "positions",
  "subjects",
  "schools",
  "school_years",
  "teachers",
  "sections",
  "users",
  "user_roles",
  "user_permissions",
  "guardians",
  "students",
  "sf10_records",
  "scholastic_records",
  "student_grades",
  "remedial_classes",
  "eligibility_records",
  "sf10_certifications",
  "student_guardians",
  "mother_tongues",
  "indigenous_groups",
  "religions",
  "student_mother_tongues",
  "student_indigenous_groups",
  "student_religions",
] as const;

export type BackupTableName = (typeof backupTableNames)[number];

export type BackupRow = Record<string, unknown>;

export type BackupTableMap = {
  [key in BackupTableName]: BackupRow[];
};

export type BackupTableDefinitionMap = {
  [key in BackupTableName]: string;
};

export interface BackupFileItem {
  filename: string;
  displayName: string;
  extension: string;
  sizeInBytes: number;
  downloadUrl: string;
  storagePath: string;
  createdAt: string;
  lastModifiedAt: string;
  source: "export" | "import";
}

export interface BackupListResponse {
  totalFiles: number;
  totalSizeInBytes: number;
  files: BackupFileItem[];
}

export interface BackupSummary {
  totalRecords: number;
  tableCounts: Record<BackupTableName, number>;
}

export interface BackupMutationResponse {
  file: BackupFileItem;
  summary: BackupSummary;
}
