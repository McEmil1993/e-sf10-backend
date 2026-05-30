import fs from "fs/promises";
import path from "path";

import mysql from "mysql2";
import type { SqlValue } from "mysql2";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";

import { backupConfig } from "../../config/backups";
import { db } from "../../config/db";
import { env } from "../../config/env";
import { HttpError } from "../../common/utils/http-error";
import {
  toBackupFileItem,
  toBackupListResponse,
  toBackupSummary,
} from "./backup.dto";
import type {
  BackupMutationResponse,
  BackupRow,
  BackupTableDefinitionMap,
  BackupTableMap,
  BackupTableName,
} from "./backup.interface";
import { backupTableNames } from "./backup.interface";

type TableDefinition = {
  columns: readonly string[];
  orderBy: string;
  datetimeColumns: readonly string[];
  dateColumns: readonly string[];
  jsonColumns: readonly string[];
};

const tableDefinitions: Record<BackupTableName, TableDefinition> = {
  modules: {
    columns: ["id", "name", "slug", "icon", "sort_order", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  permissions: {
    columns: ["id", "module_id", "name", "slug", "description", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  roles: {
    columns: ["id", "name", "description", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  role_permissions: {
    columns: ["role_id", "permission_id", "created_at", "deleted_at"],
    orderBy: "role_id ASC, permission_id ASC",
    datetimeColumns: ["created_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  positions: {
    columns: ["id", "acronym", "full_position", "category", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  subjects: {
    columns: [
      "id",
      "name",
      "subject_group",
      "grade_levels",
      "is_optional",
      "sort_order",
      "is_active",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "sort_order ASC, id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: ["grade_levels"],
  },
  schools: {
    columns: [
      "school_id",
      "deped_school_id",
      "school_name",
      "school_email",
      "school_number",
      "district",
      "division",
      "region",
      "address",
      "school_logo",
      "deped_logo",
      "other_logo",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "school_id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  school_years: {
    columns: ["id", "name", "start_date", "end_date", "is_active", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: ["start_date", "end_date"],
    jsonColumns: [],
  },
  teachers: {
    columns: ["id", "user_id", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  sections: {
    columns: ["id", "school_year_id", "grade_level", "section_name", "adviser_id", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  users: {
    columns: [
      "id",
      "name",
      "email",
      "password_hash",
      "first_name",
      "middle_name",
      "last_name",
      "suffix",
      "sex",
      "contact_number",
      "address",
      "barangay",
      "municipality_city",
      "province",
      "region",
      "username",
      "roles",
      "position",
      "status",
      "profile_picture",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: ["roles"],
  },
  user_roles: {
    columns: ["user_id", "role_id", "assigned_at", "deleted_at"],
    orderBy: "user_id ASC, role_id ASC",
    datetimeColumns: ["assigned_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  user_permissions: {
    columns: ["user_id", "permission_id", "type", "created_at", "updated_at", "deleted_at"],
    orderBy: "user_id ASC, permission_id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  guardians: {
    columns: [
      "id",
      "firstname",
      "middlename",
      "lastname",
      "suffix",
      "relationship",
      "contact_number",
      "address",
      "barangay",
      "municipality_city",
      "province",
      "region",
      "profile_picture",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  students: {
    columns: [
      "id",
      "lrn",
      "first_name",
      "middle_name",
      "last_name",
      "suffix",
      "sex",
      "birthdate",
      "birthplace",
      "street_address",
      "barangay",
      "city_municipality",
      "province",
      "region",
      "status",
      "profile_picture",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: ["birthdate"],
    jsonColumns: [],
  },
  mother_tongues: {
    columns: ["id", "name", "sort_order", "is_active", "created_at", "updated_at", "deleted_at"],
    orderBy: "sort_order ASC, id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  indigenous_groups: {
    columns: ["id", "name", "sort_order", "is_active", "created_at", "updated_at", "deleted_at"],
    orderBy: "sort_order ASC, id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  religions: {
    columns: ["id", "name", "sort_order", "is_active", "created_at", "updated_at", "deleted_at"],
    orderBy: "sort_order ASC, id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  student_mother_tongues: {
    columns: ["id", "student_id", "mother_tongue_id", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  student_indigenous_groups: {
    columns: ["id", "student_id", "indigenous_group_id", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  student_religions: {
    columns: ["id", "student_id", "religion_id", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  student_guardians: {
    columns: [
      "id",
      "student_id",
      "guardian_id",
      "relationship",
      "is_primary",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  sf10_records: {
    columns: ["id", "student_id", "school_id", "status", "remarks", "created_by", "verified_by", "certified_by", "completed_at", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["completed_at", "created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  scholastic_records: {
    columns: ["id", "sf10_record_id", "student_id", "school_id", "school_year_id", "section_id", "adviser_id", "grade_level", "section_name", "district", "division", "region", "general_average", "final_remarks", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  student_grades: {
    columns: ["id", "scholastic_record_id", "subject_id", "quarter_1", "quarter_2", "quarter_3", "quarter_4", "final_rating", "remarks", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: [],
    jsonColumns: [],
  },
  remedial_classes: {
    columns: ["id", "scholastic_record_id", "subject_id", "date_from", "date_to", "final_rating", "remedial_class_mark", "recomputed_final_grade", "remarks", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: ["date_from", "date_to"],
    jsonColumns: [],
  },
  eligibility_records: {
    columns: ["id", "student_id", "sf10_record_id", "credential_type", "school_name", "school_id_text", "school_address", "pept_rating", "exam_date", "testing_center", "other_credential", "remarks", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: ["exam_date"],
    jsonColumns: [],
  },
  sf10_certifications: {
    columns: ["id", "sf10_record_id", "student_id", "eligible_for_grade", "school_name", "school_id_text", "division", "last_school_year_attended", "principal_name", "certification_date", "created_at", "updated_at", "deleted_at"],
    orderBy: "id ASC",
    datetimeColumns: ["created_at", "updated_at", "deleted_at"],
    dateColumns: ["certification_date"],
    jsonColumns: [],
  },
};

const deleteOrder: BackupTableName[] = [
  "sf10_certifications",
  "eligibility_records",
  "remedial_classes",
  "student_grades",
  "scholastic_records",
  "sf10_records",
  "user_permissions",
  "user_roles",
  "role_permissions",
  "permissions",
  "roles",
  "modules",
  "student_religions",
  "student_indigenous_groups",
  "student_mother_tongues",
  "student_guardians",
  "students",
  "sections",
  "teachers",
  "school_years",
  "schools",
  "religions",
  "indigenous_groups",
  "mother_tongues",
  "guardians",
  "subjects",
  "positions",
  "users",
];

const createOrder: BackupTableName[] = [
  "modules",
  "permissions",
  "roles",
  "positions",
  "subjects",
  "schools",
  "school_years",
  "users",
  "teachers",
  "sections",
  "guardians",
  "mother_tongues",
  "indigenous_groups",
  "religions",
  "role_permissions",
  "user_roles",
  "user_permissions",
  "students",
  "sf10_records",
  "scholastic_records",
  "student_grades",
  "remedial_classes",
  "eligibility_records",
  "sf10_certifications",
  "student_mother_tongues",
  "student_indigenous_groups",
  "student_religions",
  "student_guardians",
];

const insertOrder: BackupTableName[] = [
  "modules",
  "permissions",
  "roles",
  "positions",
  "subjects",
  "schools",
  "school_years",
  "users",
  "teachers",
  "sections",
  "guardians",
  "mother_tongues",
  "indigenous_groups",
  "religions",
  "role_permissions",
  "user_roles",
  "user_permissions",
  "students",
  "sf10_records",
  "scholastic_records",
  "student_grades",
  "remedial_classes",
  "eligibility_records",
  "sf10_certifications",
  "student_mother_tongues",
  "student_indigenous_groups",
  "student_religions",
  "student_guardians",
];

const sqlHeaderPrefix = "-- E-SF10 MySQL Backup";
const escapedDatabaseName = env.DB_NAME.replace(/`/g, "``");
const databaseCreateSql = `CREATE DATABASE IF NOT EXISTS \`${escapedDatabaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;

const padNumber = (value: number): string => String(value).padStart(2, "0");

const formatDateValue = (value: Date, dateOnly = false): string => {
  const year = value.getFullYear();
  const month = padNumber(value.getMonth() + 1);
  const day = padNumber(value.getDate());

  if (dateOnly) {
    return `${year}-${month}-${day}`;
  }

  const hours = padNumber(value.getHours());
  const minutes = padNumber(value.getMinutes());
  const seconds = padNumber(value.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const normalizeScalarForBackup = (
  tableName: BackupTableName,
  columnName: string,
  value: unknown,
): unknown => {
  const definition = tableDefinitions[tableName];

  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    if (definition.dateColumns.includes(columnName)) {
      return formatDateValue(value, true);
    }

    if (definition.datetimeColumns.includes(columnName)) {
      return formatDateValue(value);
    }
  }

  if (definition.jsonColumns.includes(columnName) && typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

const normalizeScalarForInsert = (
  tableName: BackupTableName,
  columnName: string,
  value: unknown,
): unknown => {
  const definition = tableDefinitions[tableName];

  if (value === undefined || value === null) {
    return null;
  }

  if (definition.jsonColumns.includes(columnName)) {
    return typeof value === "string" ? value : JSON.stringify(value);
  }

  if (value instanceof Date) {
    return formatDateValue(value, definition.dateColumns.includes(columnName));
  }

  if (
    (definition.dateColumns.includes(columnName) || definition.datetimeColumns.includes(columnName)) &&
    typeof value === "string"
  ) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    if (definition.dateColumns.includes(columnName) && /^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return trimmedValue;
    }

    if (
      definition.datetimeColumns.includes(columnName) &&
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmedValue)
    ) {
      return trimmedValue;
    }

    const parsedDate = new Date(trimmedValue);

    if (!Number.isNaN(parsedDate.getTime())) {
      return formatDateValue(parsedDate, definition.dateColumns.includes(columnName));
    }

    return trimmedValue;
  }

  return value;
};

const getBackupFilePath = (filename: string): string => {
  const resolvedPath = path.resolve(backupConfig.directoryPath, filename);

  if (!resolvedPath.startsWith(path.resolve(backupConfig.directoryPath))) {
    throw new HttpError(400, "Invalid backup file path.");
  }

  return resolvedPath;
};

const createBackupFilename = (prefix: "backup" | "imported"): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = padNumber(now.getHours());
  const minutes = padNumber(now.getMinutes());
  const seconds = padNumber(now.getSeconds());

  return `${prefix}-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.sql`;
};

const readTableRows = async (tableName: BackupTableName): Promise<BackupRow[]> => {
  const definition = tableDefinitions[tableName];
  const selectColumns = definition.columns.map((columnName) => `\`${columnName}\``).join(", ");
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT ${selectColumns} FROM \`${tableName}\` ORDER BY ${definition.orderBy}`,
  );

  return rows.map((row) => {
    const normalizedRow: BackupRow = {};

    for (const columnName of definition.columns) {
      normalizedRow[columnName] = normalizeScalarForBackup(tableName, columnName, row[columnName]);
    }

    return normalizedRow;
  });
};

const buildBackupDataset = async (): Promise<BackupTableMap> => {
  const tables = {} as BackupTableMap;

  for (const tableName of backupTableNames) {
    tables[tableName] = await readTableRows(tableName);
  }

  return tables;
};

interface ShowCreateTableRow extends RowDataPacket {
  Table: string;
  "Create Table": string;
}

const readTableDefinition = async (tableName: BackupTableName): Promise<string> => {
  const [rows] = await db.query<ShowCreateTableRow[]>(`SHOW CREATE TABLE \`${tableName}\``);
  const createTableSql = rows[0]?.["Create Table"];

  if (!createTableSql) {
    throw new HttpError(500, `Unable to read schema definition for table \`${tableName}\`.`);
  }

  return `${createTableSql};`;
};

const buildTableDefinitions = async (): Promise<BackupTableDefinitionMap> => {
  const definitions = {} as BackupTableDefinitionMap;

  for (const tableName of createOrder) {
    definitions[tableName] = await readTableDefinition(tableName);
  }

  return definitions;
};

const ensureBackupFileExists = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
  } catch {
    throw new HttpError(404, "Backup file not found.");
  }
};

const createSqlLiteral = (
  tableName: BackupTableName,
  columnName: string,
  value: unknown,
): string => {
  const normalizedValue = normalizeScalarForInsert(tableName, columnName, value);

  if (normalizedValue === null) {
    return "NULL";
  }

  return mysql.escape(normalizedValue as SqlValue);
};

const buildInsertStatements = (tableName: BackupTableName, rows: BackupRow[]): string[] => {
  if (rows.length === 0) {
    return [];
  }

  const definition = tableDefinitions[tableName];
  const escapedColumns = definition.columns.map((columnName) => `\`${columnName}\``).join(", ");
  const chunkSize = 100;
  const statements: string[] = [];

  for (let startIndex = 0; startIndex < rows.length; startIndex += chunkSize) {
    const chunk = rows.slice(startIndex, startIndex + chunkSize);
    const valuesSql = chunk
      .map((row) => {
        const rowValues = definition.columns.map((columnName) =>
          createSqlLiteral(tableName, columnName, row[columnName]),
        );

        return `(${rowValues.join(", ")})`;
      })
      .join(",\n");

    statements.push(`INSERT INTO \`${tableName}\` (${escapedColumns}) VALUES\n${valuesSql};`);
  }

  return statements;
};

const buildSqlBackupContents = (
  tables: BackupTableMap,
  tableDefinitionsMap: BackupTableDefinitionMap,
  exportedAt: string,
): string => {
  const lines: string[] = [
    sqlHeaderPrefix,
    "-- Format: mysql-sql-v1",
    `-- Exported At: ${exportedAt}`,
    `-- Source Database: ${env.DB_NAME}`,
    "",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
    `DROP DATABASE IF EXISTS \`${escapedDatabaseName}\`;`,
    databaseCreateSql,
    `USE \`${escapedDatabaseName}\`;`,
    "",
  ];

  for (const tableName of deleteOrder) {
    lines.push(`DROP TABLE IF EXISTS \`${tableName}\`;`);
  }

  lines.push("");

  for (const tableName of createOrder) {
    lines.push(`-- Structure for table \`${tableName}\``);
    lines.push(tableDefinitionsMap[tableName]);
    lines.push("");
  }

  lines.push("START TRANSACTION;");
  lines.push("");

  for (const tableName of insertOrder) {
    const statements = buildInsertStatements(tableName, tables[tableName]);

    if (statements.length === 0) {
      continue;
    }

    lines.push(`-- Data for table \`${tableName}\``);
    lines.push(...statements);
    lines.push("");
  }

  lines.push("COMMIT;");
  lines.push("SET FOREIGN_KEY_CHECKS = 1;");
  lines.push("");

  return lines.join("\n");
};

const isDatabaseLevelStatement = (statement: string): boolean => {
  const normalizedStatement = statement.trim().replace(/\s+/g, " ").toUpperCase();

  return (
    normalizedStatement.startsWith("DROP DATABASE ") ||
    normalizedStatement.startsWith("CREATE DATABASE ") ||
    normalizedStatement.startsWith("USE ")
  );
};

const splitSqlStatements = (script: string): string[] => {
  const statements: string[] = [];
  let currentStatement = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < script.length; index += 1) {
    const currentChar = script[index];
    const nextChar = script[index + 1];

    if (inLineComment) {
      if (currentChar === "\n") {
        inLineComment = false;
      }

      continue;
    }

    if (inBlockComment) {
      if (currentChar === "*" && nextChar === "/") {
        inBlockComment = false;
        index += 1;
      }

      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (currentChar === "-" && nextChar === "-" && /\s/.test(script[index + 2] ?? "")) {
        inLineComment = true;
        index += 1;
        continue;
      }

      if (currentChar === "#") {
        inLineComment = true;
        continue;
      }

      if (currentChar === "/" && nextChar === "*") {
        inBlockComment = true;
        index += 1;
        continue;
      }
    }

    if (currentChar === "'" && !inDoubleQuote && !inBacktick) {
      currentStatement += currentChar;

      if (inSingleQuote && nextChar === "'") {
        currentStatement += nextChar;
        index += 1;
        continue;
      }

      if (script[index - 1] !== "\\") {
        inSingleQuote = !inSingleQuote;
      }

      continue;
    }

    if (currentChar === '"' && !inSingleQuote && !inBacktick) {
      currentStatement += currentChar;

      if (script[index - 1] !== "\\") {
        inDoubleQuote = !inDoubleQuote;
      }

      continue;
    }

    if (currentChar === "`" && !inSingleQuote && !inDoubleQuote) {
      currentStatement += currentChar;
      inBacktick = !inBacktick;
      continue;
    }

    if (currentChar === ";" && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      const trimmedStatement = currentStatement.trim();

      if (trimmedStatement) {
        statements.push(trimmedStatement);
      }

      currentStatement = "";
      continue;
    }

    currentStatement += currentChar;
  }

  const trimmedStatement = currentStatement.trim();

  if (trimmedStatement) {
    statements.push(trimmedStatement);
  }

  return statements;
};

const normalizeSqlScript = (sqlScript: string): string => {
  return sqlScript.replace(/^\uFEFF/, "").trim();
};

const getExecutableStatements = (sqlScript: string): string[] => {
  if (!sqlScript.startsWith(sqlHeaderPrefix)) {
    throw new HttpError(
      400,
      "Invalid backup file. Expected an E-SF10 MySQL SQL backup generated by this system.",
    );
  }

  const statements = splitSqlStatements(sqlScript);

  if (statements.length === 0) {
    throw new HttpError(400, "Invalid backup file. No SQL statements were found.");
  }

  const executableStatements = statements.filter((statement) => !isDatabaseLevelStatement(statement));

  if (executableStatements.length === 0) {
    throw new HttpError(400, "Invalid backup file. No executable SQL statements were found.");
  }

  return executableStatements;
};

const getCurrentTableCounts = async (
  connection: PoolConnection,
): Promise<Record<BackupTableName, number>> => {
  const counts = {} as Record<BackupTableName, number>;

  for (const tableName of backupTableNames) {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalCount FROM \`${tableName}\``,
    );

    counts[tableName] = Number(rows[0]?.totalCount ?? 0);
  }

  return counts;
};

const executeBackupImport = async (
  sqlScript: string,
): Promise<Record<BackupTableName, number>> => {
  const executableStatements = getExecutableStatements(sqlScript);
  const connection = await db.getConnection();

  try {
    for (const statement of executableStatements) {
      await connection.query(statement);
    }

    return await getCurrentTableCounts(connection);
  } catch (error) {
    try {
      await connection.query("ROLLBACK");
    } catch {
      // Best effort rollback only.
    }

    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch {
      // Best effort cleanup only.
    }

    throw error;
  } finally {
    connection.release();
  }
};

const writeBackupFile = async (
  filename: string,
  fileContents: string,
  tableCounts: Record<BackupTableName, number>,
  baseUrl: string,
): Promise<BackupMutationResponse> => {
  const filePath = getBackupFilePath(filename);
  await fs.writeFile(filePath, fileContents, "utf8");
  const stats = await fs.stat(filePath);
  const file = toBackupFileItem(filename, stats, baseUrl, filePath);

  return {
    file,
    summary: toBackupSummary(tableCounts),
  };
};

export const backupService = {
  async listBackups(baseUrl: string) {
    const entries = await fs.readdir(backupConfig.directoryPath, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".sql")
        .map(async (entry) => {
          const filePath = getBackupFilePath(entry.name);
          const stats = await fs.stat(filePath);
          return toBackupFileItem(entry.name, stats, baseUrl, filePath);
        }),
    );

    files.sort((left, right) => {
      return new Date(right.lastModifiedAt).getTime() - new Date(left.lastModifiedAt).getTime();
    });

    return toBackupListResponse(files);
  },

  async exportBackup(baseUrl: string): Promise<BackupMutationResponse> {
    const tables = await buildBackupDataset();
    const tableDefinitionsMap = await buildTableDefinitions();
    const exportedAt = new Date().toISOString();
    const fileContents = buildSqlBackupContents(tables, tableDefinitionsMap, exportedAt);
    const tableCounts = backupTableNames.reduce(
      (accumulator, tableName) => {
        accumulator[tableName] = tables[tableName].length;
        return accumulator;
      },
      {} as Record<BackupTableName, number>,
    );

    return writeBackupFile(createBackupFilename("backup"), fileContents, tableCounts, baseUrl);
  },

  async getBackupFile(filename: string, baseUrl: string) {
    const filePath = getBackupFilePath(filename);

    await ensureBackupFileExists(filePath);

    const stats = await fs.stat(filePath);
    return toBackupFileItem(filename, stats, baseUrl, filePath);
  },

  async importBackupFromFile(
    file: Express.Multer.File,
    baseUrl: string,
  ): Promise<BackupMutationResponse> {
    const sqlScript = normalizeSqlScript(file.buffer.toString("utf8"));
    const tableCounts = await executeBackupImport(sqlScript);

    return writeBackupFile(
      createBackupFilename("imported"),
      sqlScript.endsWith("\n") ? sqlScript : `${sqlScript}\n`,
      tableCounts,
      baseUrl,
    );
  },

  async importBackupFromStorage(filename: string, baseUrl: string): Promise<BackupMutationResponse> {
    const filePath = getBackupFilePath(filename);

    await ensureBackupFileExists(filePath);

    const sqlScript = normalizeSqlScript(await fs.readFile(filePath, "utf8"));
    const tableCounts = await executeBackupImport(sqlScript);

    return writeBackupFile(
      createBackupFilename("imported"),
      sqlScript.endsWith("\n") ? sqlScript : `${sqlScript}\n`,
      tableCounts,
      baseUrl,
    );
  },
};
