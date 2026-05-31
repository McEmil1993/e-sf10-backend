import type { RowDataPacket } from "mysql2";

export type AcademicEntityKey =
  | "school-years"
  | "teachers"
  | "sections"
  | "enrollments"
  | "sf10-records"
  | "scholastic-records"
  | "grades"
  | "remedial-classes"
  | "eligibility-records"
  | "certifications";

export type AcademicFieldType = "string" | "number" | "boolean" | "date" | "datetime";

export type AcademicFieldDefinition = {
  requestKey: string;
  columnName: string;
  type: AcademicFieldType;
  required?: boolean;
  nullable?: boolean;
  defaultValue?: string | number | boolean | null;
};

export type AcademicVirtualFieldDefinition = {
  requestKey: string;
  selectSql: string;
  type?: AcademicFieldType;
};

export type AcademicEntityDefinition = {
  key: AcademicEntityKey;
  tableName: string;
  idColumn: string;
  label: string;
  orderBy: string;
  fields: AcademicFieldDefinition[];
  joins?: string;
  virtualFields?: AcademicVirtualFieldDefinition[];
};

export type AcademicRow = RowDataPacket & Record<string, unknown>;
