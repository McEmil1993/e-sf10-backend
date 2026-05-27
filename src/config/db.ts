import mysql from "mysql2/promise";
import type { Pool, RowDataPacket } from "mysql2/promise";

import { env } from "./env";

const escapedDatabaseName = env.DB_NAME.replace(/`/g, "``");

export const db: Pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    email VARCHAR(191) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    suffix VARCHAR(30) NULL,
    sex VARCHAR(20) NULL,
    contact_number VARCHAR(30) NULL,
    address VARCHAR(255) NULL,
    barangay VARCHAR(100) NULL,
    municipality_city VARCHAR(100) NULL,
    province VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    username VARCHAR(100) NULL,
    roles JSON NULL,
    position VARCHAR(150) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    profile_picture VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email),
    UNIQUE KEY users_username_unique (username),
    KEY idx_users_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createPositionsTableSql = `
  CREATE TABLE IF NOT EXISTS positions (
    id INT NOT NULL AUTO_INCREMENT,
    acronym VARCHAR(20) NOT NULL,
    full_position VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_positions_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createSchoolsTableSql = `
  CREATE TABLE IF NOT EXISTS schools (
    school_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    deped_school_id VARCHAR(50) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    district VARCHAR(150) NOT NULL,
    division VARCHAR(150) NOT NULL,
    region VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    school_logo VARCHAR(255) NULL,
    deped_logo VARCHAR(255) NULL,
    other_logo VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (school_id),
    UNIQUE KEY schools_deped_school_id_unique (deped_school_id),
    KEY idx_schools_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentsTableSql = `
  CREATE TABLE IF NOT EXISTS students (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    lrn VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL DEFAULT NULL,
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(20) NULL DEFAULT NULL,
    sex ENUM('male','female') NOT NULL,
    birthdate DATE NOT NULL,
    birthplace VARCHAR(150) NULL DEFAULT NULL,
    street_address VARCHAR(255) NULL DEFAULT NULL,
    barangay VARCHAR(100) NOT NULL,
    city_municipality VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    status ENUM('active','inactive','transferred','graduated') NULL DEFAULT 'active',
    profile_picture VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY students_lrn_unique (lrn),
    KEY idx_students_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createGuardiansTableSql = `
  CREATE TABLE IF NOT EXISTS guardians (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100) NULL,
    lastname VARCHAR(100) NOT NULL,
    suffix VARCHAR(20) NULL,
    relationship VARCHAR(50) NOT NULL DEFAULT 'guardian',
    contact_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    municipality_city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_guardians_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentGuardiansTableSql = `
  CREATE TABLE IF NOT EXISTS student_guardians (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,
    guardian_id BIGINT UNSIGNED NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_primary TINYINT(1) NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_student_guardians_deleted_at (deleted_at),
    KEY fk_pg_student (student_id),
    KEY fk_pg_guardian (guardian_id),
    CONSTRAINT fk_pg_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pg_guardian FOREIGN KEY (guardian_id) REFERENCES guardians (id) ON UPDATE NO ACTION ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createMotherTonguesTableSql = `
  CREATE TABLE IF NOT EXISTS mother_tongues (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY mother_tongues_name_unique (name),
    KEY idx_mother_tongues_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createIndigenousGroupsTableSql = `
  CREATE TABLE IF NOT EXISTS indigenous_groups (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY indigenous_groups_name_unique (name),
    KEY idx_indigenous_groups_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createReligionsTableSql = `
  CREATE TABLE IF NOT EXISTS religions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY religions_name_unique (name),
    KEY idx_religions_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentMotherTonguesTableSql = `
  CREATE TABLE IF NOT EXISTS student_mother_tongues (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,
    mother_tongue_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY student_mother_tongues_student_unique (student_id),
    KEY fk_pmt_mother_tongue (mother_tongue_id),
    KEY idx_student_mother_tongues_deleted_at (deleted_at),
    CONSTRAINT fk_pmt_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pmt_mother_tongue FOREIGN KEY (mother_tongue_id) REFERENCES mother_tongues (id) ON UPDATE NO ACTION ON DELETE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentIndigenousGroupsTableSql = `
  CREATE TABLE IF NOT EXISTS student_indigenous_groups (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,
    indigenous_group_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY student_indigenous_groups_student_unique (student_id),
    KEY fk_pig_indigenous_group (indigenous_group_id),
    KEY idx_student_indigenous_groups_deleted_at (deleted_at),
    CONSTRAINT fk_pig_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pig_indigenous_group FOREIGN KEY (indigenous_group_id) REFERENCES indigenous_groups (id) ON UPDATE NO ACTION ON DELETE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentReligionsTableSql = `
  CREATE TABLE IF NOT EXISTS student_religions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,
    religion_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY student_religions_student_unique (student_id),
    KEY fk_pr_religion (religion_id),
    KEY idx_student_religions_deleted_at (deleted_at),
    CONSTRAINT fk_pr_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pr_religion FOREIGN KEY (religion_id) REFERENCES religions (id) ON UPDATE NO ACTION ON DELETE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createStudentGuardiansViewSql = `
  CREATE OR REPLACE VIEW vw_student_guardians AS
  SELECT
    pg.id,
    pg.student_id AS studentId,
    pg.guardian_id AS guardianId,
    pg.relationship,
    pg.is_primary AS isPrimary,
    pg.created_at AS createdAt,
    pg.updated_at AS updatedAt,
    pg.deleted_at AS deletedAt,
    g.firstname AS guardianFirstName,
    g.middlename AS guardianMiddleName,
    g.lastname AS guardianLastName,
    g.suffix AS guardianSuffix,
    g.relationship AS guardianRelationship,
    g.contact_number AS guardianContactNumber,
    g.address AS guardianAddress,
    g.barangay AS guardianBarangay,
    g.municipality_city AS guardianMunicipalityCity,
    g.province AS guardianProvince,
    g.region AS guardianRegion,
    g.profile_picture AS guardianProfilePicture,
    g.created_at AS guardianCreatedAt,
    g.updated_at AS guardianUpdatedAt,
    g.deleted_at AS guardianDeletedAt,
    p.lrn AS studentLrn,
    p.first_name AS studentFirstName,
    p.middle_name AS studentMiddleName,
    p.last_name AS studentLastName,
    p.suffix AS studentSuffix
  FROM student_guardians pg
  INNER JOIN guardians g ON g.id = pg.guardian_id
  INNER JOIN students p ON p.id = pg.student_id
  WHERE pg.deleted_at IS NULL
    AND g.deleted_at IS NULL
    AND p.deleted_at IS NULL;
`;

const createStudentInformationViewSql = `
  CREATE OR REPLACE VIEW vw_student_information AS
  SELECT
    p.id AS studentId,
    p.lrn AS studentLrn,
    mt.id AS motherTongueId,
    mt.name AS motherTongueName,
    mt.sort_order AS motherTongueSortOrder,
    mt.is_active AS motherTongueIsActive,
    ig.id AS indigenousGroupId,
    ig.name AS indigenousGroupName,
    ig.sort_order AS indigenousGroupSortOrder,
    ig.is_active AS indigenousGroupIsActive,
    r.id AS religionId,
    r.name AS religionName,
    r.sort_order AS religionSortOrder,
    r.is_active AS religionIsActive
  FROM students p
  LEFT JOIN student_mother_tongues pmt
    ON pmt.student_id = p.id
    AND pmt.deleted_at IS NULL
  LEFT JOIN mother_tongues mt
    ON mt.id = pmt.mother_tongue_id
    AND mt.deleted_at IS NULL
  LEFT JOIN student_indigenous_groups pig
    ON pig.student_id = p.id
    AND pig.deleted_at IS NULL
  LEFT JOIN indigenous_groups ig
    ON ig.id = pig.indigenous_group_id
    AND ig.deleted_at IS NULL
  LEFT JOIN student_religions pr
    ON pr.student_id = p.id
    AND pr.deleted_at IS NULL
  LEFT JOIN religions r
    ON r.id = pr.religion_id
    AND r.deleted_at IS NULL
  WHERE p.deleted_at IS NULL;
`;

const userColumnMigrations = [
  { name: "name", sql: "ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL AFTER id" },
  { name: "middle_name", sql: "ALTER TABLE users ADD COLUMN middle_name VARCHAR(100) NULL AFTER first_name" },
  { name: "suffix", sql: "ALTER TABLE users ADD COLUMN suffix VARCHAR(30) NULL AFTER last_name" },
  { name: "sex", sql: "ALTER TABLE users ADD COLUMN sex VARCHAR(20) NULL AFTER suffix" },
  { name: "contact_number", sql: "ALTER TABLE users ADD COLUMN contact_number VARCHAR(30) NULL AFTER email" },
  { name: "address", sql: "ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL AFTER contact_number" },
  { name: "barangay", sql: "ALTER TABLE users ADD COLUMN barangay VARCHAR(100) NULL AFTER address" },
  {
    name: "municipality_city",
    sql: "ALTER TABLE users ADD COLUMN municipality_city VARCHAR(100) NULL AFTER barangay",
  },
  { name: "province", sql: "ALTER TABLE users ADD COLUMN province VARCHAR(100) NULL AFTER municipality_city" },
  { name: "region", sql: "ALTER TABLE users ADD COLUMN region VARCHAR(100) NULL AFTER province" },
  { name: "username", sql: "ALTER TABLE users ADD COLUMN username VARCHAR(100) NULL AFTER region" },
  { name: "roles", sql: "ALTER TABLE users ADD COLUMN roles JSON NULL AFTER username" },
  { name: "position", sql: "ALTER TABLE users ADD COLUMN position VARCHAR(150) NULL AFTER roles" },
  { name: "status", sql: "ALTER TABLE users ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'active' AFTER position" },
  {
    name: "profile_picture",
    sql: "ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) NULL AFTER status",
  },
  { name: "deleted_at", sql: "ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const userIndexMigrations = [
  { name: "users_email_unique", sql: "ALTER TABLE users ADD UNIQUE KEY users_email_unique (email)" },
  { name: "users_username_unique", sql: "ALTER TABLE users ADD UNIQUE KEY users_username_unique (username)" },
  { name: "idx_users_deleted_at", sql: "ALTER TABLE users ADD INDEX idx_users_deleted_at (deleted_at)" },
] as const;

const positionColumnMigrations = [
  { name: "acronym", sql: "ALTER TABLE positions ADD COLUMN acronym VARCHAR(20) NOT NULL AFTER id" },
  {
    name: "full_position",
    sql: "ALTER TABLE positions ADD COLUMN full_position VARCHAR(100) NOT NULL AFTER acronym",
  },
  {
    name: "category",
    sql: "ALTER TABLE positions ADD COLUMN category VARCHAR(50) NOT NULL AFTER full_position",
  },
  {
    name: "created_at",
    sql: "ALTER TABLE positions ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER category",
  },
  {
    name: "updated_at",
    sql:
      "ALTER TABLE positions ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
  },
  {
    name: "deleted_at",
    sql: "ALTER TABLE positions ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at",
  },
] as const;

const positionIndexMigrations = [
  { name: "idx_positions_deleted_at", sql: "ALTER TABLE positions ADD INDEX idx_positions_deleted_at (deleted_at)" },
] as const;

const schoolColumnMigrations = [
  { name: "deped_school_id", sql: "ALTER TABLE schools ADD COLUMN deped_school_id VARCHAR(50) NOT NULL AFTER school_id" },
  { name: "school_name", sql: "ALTER TABLE schools ADD COLUMN school_name VARCHAR(255) NOT NULL AFTER deped_school_id" },
  { name: "district", sql: "ALTER TABLE schools ADD COLUMN district VARCHAR(150) NOT NULL AFTER school_name" },
  { name: "division", sql: "ALTER TABLE schools ADD COLUMN division VARCHAR(150) NOT NULL AFTER district" },
  { name: "region", sql: "ALTER TABLE schools ADD COLUMN region VARCHAR(150) NOT NULL AFTER division" },
  { name: "address", sql: "ALTER TABLE schools ADD COLUMN address VARCHAR(255) NOT NULL AFTER region" },
  { name: "school_logo", sql: "ALTER TABLE schools ADD COLUMN school_logo VARCHAR(255) NULL AFTER address" },
  { name: "deped_logo", sql: "ALTER TABLE schools ADD COLUMN deped_logo VARCHAR(255) NULL AFTER school_logo" },
  { name: "other_logo", sql: "ALTER TABLE schools ADD COLUMN other_logo VARCHAR(255) NULL AFTER deped_logo" },
  {
    name: "created_at",
    sql: "ALTER TABLE schools ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER other_logo",
  },
  {
    name: "updated_at",
    sql:
      "ALTER TABLE schools ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
  },
  { name: "deleted_at", sql: "ALTER TABLE schools ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const schoolIndexMigrations = [
  { name: "schools_deped_school_id_unique", sql: "ALTER TABLE schools ADD UNIQUE KEY schools_deped_school_id_unique (deped_school_id)" },
  { name: "idx_schools_deleted_at", sql: "ALTER TABLE schools ADD INDEX idx_schools_deleted_at (deleted_at)" },
] as const;

const studentColumnMigrations = [
  { name: "lrn", sql: "ALTER TABLE students ADD COLUMN lrn VARCHAR(20) NOT NULL AFTER id" },
  { name: "first_name", sql: "ALTER TABLE students ADD COLUMN first_name VARCHAR(100) NOT NULL AFTER lrn" },
  { name: "middle_name", sql: "ALTER TABLE students ADD COLUMN middle_name VARCHAR(100) NULL DEFAULT NULL AFTER first_name" },
  { name: "last_name", sql: "ALTER TABLE students ADD COLUMN last_name VARCHAR(100) NOT NULL AFTER middle_name" },
  { name: "suffix", sql: "ALTER TABLE students ADD COLUMN suffix VARCHAR(20) NULL DEFAULT NULL AFTER last_name" },
  { name: "sex", sql: "ALTER TABLE students ADD COLUMN sex ENUM('male','female') NOT NULL AFTER suffix" },
  { name: "birthdate", sql: "ALTER TABLE students ADD COLUMN birthdate DATE NOT NULL AFTER sex" },
  { name: "birthplace", sql: "ALTER TABLE students ADD COLUMN birthplace VARCHAR(150) NULL DEFAULT NULL AFTER birthdate" },
  { name: "street_address", sql: "ALTER TABLE students ADD COLUMN street_address VARCHAR(255) NULL DEFAULT NULL AFTER birthplace" },
  { name: "barangay", sql: "ALTER TABLE students ADD COLUMN barangay VARCHAR(100) NOT NULL AFTER street_address" },
  { name: "city_municipality", sql: "ALTER TABLE students ADD COLUMN city_municipality VARCHAR(100) NOT NULL AFTER barangay" },
  { name: "province", sql: "ALTER TABLE students ADD COLUMN province VARCHAR(100) NOT NULL AFTER city_municipality" },
  { name: "region", sql: "ALTER TABLE students ADD COLUMN region VARCHAR(100) NOT NULL AFTER province" },
  { name: "status", sql: "ALTER TABLE students ADD COLUMN status ENUM('active','inactive','transferred','graduated') NULL DEFAULT 'active' AFTER region" },
  { name: "profile_picture", sql: "ALTER TABLE students ADD COLUMN profile_picture VARCHAR(255) NULL AFTER status" },
  { name: "deleted_at", sql: "ALTER TABLE students ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const studentIndexMigrations = [
  { name: "students_lrn_unique", sql: "ALTER TABLE students ADD UNIQUE KEY students_lrn_unique (lrn)" },
  { name: "idx_students_deleted_at", sql: "ALTER TABLE students ADD INDEX idx_students_deleted_at (deleted_at)" },
] as const;

const guardianColumnMigrations = [
  { name: "firstname", sql: "ALTER TABLE guardians ADD COLUMN firstname VARCHAR(100) NOT NULL AFTER id" },
  { name: "middlename", sql: "ALTER TABLE guardians ADD COLUMN middlename VARCHAR(100) NULL AFTER firstname" },
  { name: "lastname", sql: "ALTER TABLE guardians ADD COLUMN lastname VARCHAR(100) NOT NULL AFTER middlename" },
  { name: "suffix", sql: "ALTER TABLE guardians ADD COLUMN suffix VARCHAR(20) NULL AFTER lastname" },
  {
    name: "relationship",
    sql: "ALTER TABLE guardians ADD COLUMN relationship VARCHAR(50) NOT NULL DEFAULT 'guardian' AFTER suffix",
  },
  {
    name: "contact_number",
    sql: "ALTER TABLE guardians ADD COLUMN contact_number VARCHAR(20) NOT NULL AFTER relationship",
  },
  { name: "address", sql: "ALTER TABLE guardians ADD COLUMN address VARCHAR(255) NOT NULL AFTER contact_number" },
  { name: "barangay", sql: "ALTER TABLE guardians ADD COLUMN barangay VARCHAR(100) NOT NULL AFTER address" },
  {
    name: "municipality_city",
    sql: "ALTER TABLE guardians ADD COLUMN municipality_city VARCHAR(100) NOT NULL AFTER barangay",
  },
  { name: "province", sql: "ALTER TABLE guardians ADD COLUMN province VARCHAR(100) NOT NULL AFTER municipality_city" },
  { name: "region", sql: "ALTER TABLE guardians ADD COLUMN region VARCHAR(100) NOT NULL AFTER province" },
  { name: "profile_picture", sql: "ALTER TABLE guardians ADD COLUMN profile_picture VARCHAR(255) NULL AFTER region" },
  { name: "deleted_at", sql: "ALTER TABLE guardians ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const guardianIndexMigrations = [
  { name: "idx_guardians_deleted_at", sql: "ALTER TABLE guardians ADD INDEX idx_guardians_deleted_at (deleted_at)" },
] as const;

const motherTongueSeedValues = [
  "Filipino / Tagalog",
  "Cebuano / Bisaya",
  "Ilocano",
  "Hiligaynon (Ilonggo)",
  "Waray",
  "Kapampangan",
  "Pangasinan",
  "Bikol / Bicolano",
  "Maranao",
  "Maguindanaoan",
  "Tausug",
  "Chavacano",
  "Ivatan",
  "Ifugao",
  "Kankanaey",
  "Ibaloi",
  "N/A",
] as const;

const indigenousGroupSeedValues = [
  "Aeta / Agta",
  "Igorot",
  "Ifugao",
  "Bontoc",
  "Kankanaey",
  "Ibaloi",
  "Mangyan",
  "Iraya",
  "Alangan",
  "Tadyawan",
  "Lumad",
  "Manobo",
  "T'boli",
  "Subanen",
  "B'laan",
  "Higaonon",
  "Badjao / Sama-Bajau",
  "Tausug (also ethnic group in Sulu)",
  "Maranao",
  "Yakan",
  "Non-IP / Not Applicable",
  "Other",
] as const;

const religionSeedValues = [
  "Roman Catholic",
  "Islam",
  "Iglesia ni Cristo",
  "Born Again Christian",
  "Protestant",
  "Seventh-day Adventist",
  "Jehovah's Witnesses",
  "Baptist",
  "Evangelical",
  "LDS / Mormon",
  "Hinduism",
  "Buddhism",
  "Other Christian Denominations",
  "N/A",
] as const;

interface ColumnRow extends RowDataPacket {
  Field: string;
}

interface IndexRow extends RowDataPacket {
  Key_name: string;
}

interface TableRow extends RowDataPacket {
  tableName: string;
}

interface ConstraintRow extends RowDataPacket {
  CONSTRAINT_NAME: string;
}

const ensureDatabaseExists = async (): Promise<void> => {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    port: env.DB_PORT,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${escapedDatabaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
};

export const verifyDatabaseConnection = async (): Promise<void> => {
  const connection = await db.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

const hasUsersColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM users");
  return rows.some((row) => row.Field === columnName);
};

const hasTable = async (tableName: string): Promise<boolean> => {
  const [rows] = await db.query<TableRow[]>(
    `
      SELECT TABLE_NAME AS tableName
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      LIMIT 1
    `,
    [env.DB_NAME, tableName],
  );

  return rows.length > 0;
};

const renameTableIfNeeded = async (fromName: string, toName: string): Promise<void> => {
  if ((await hasTable(fromName)) && !(await hasTable(toName))) {
    await db.execute(`RENAME TABLE \`${fromName}\` TO \`${toName}\``);
  }
};

const hasColumn = async (tableName: string, columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>(`SHOW COLUMNS FROM \`${tableName}\``);
  return rows.some((row) => row.Field === columnName);
};

const dropForeignKeyIfExists = async (tableName: string, constraintName: string): Promise<void> => {
  const [rows] = await db.query<ConstraintRow[]>(
    `
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = ?
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      LIMIT 1
    `,
    [env.DB_NAME, tableName, constraintName],
  );

  if (rows.length > 0) {
    await db.execute(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${constraintName}\``);
  }
};

const hasForeignKey = async (tableName: string, constraintName: string): Promise<boolean> => {
  const [rows] = await db.query<ConstraintRow[]>(
    `
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = ?
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      LIMIT 1
    `,
    [env.DB_NAME, tableName, constraintName],
  );

  return rows.length > 0;
};

const hasIndex = async (tableName: string, indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>(`SHOW INDEX FROM \`${tableName}\``);
  return rows.some((row) => row.Key_name === indexName);
};

const dropIndexIfExists = async (tableName: string, indexName: string): Promise<void> => {
  if (await hasIndex(tableName, indexName)) {
    await db.execute(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
  }
};

const migrateLegacyStudentTables = async (): Promise<void> => {
  const legacyBase = ["pu", "pil"].join("");
  const legacyPlural = `${legacyBase}s`;
  const legacyIdColumn = `${legacyBase}_id`;
  const legacyGuardiansTable = `${legacyBase}_guardians`;
  const legacyMotherTonguesTable = `${legacyBase}_mother_tongues`;
  const legacyIndigenousGroupsTable = `${legacyBase}_indigenous_groups`;
  const legacyReligionsTable = `${legacyBase}_religions`;

  await db.execute("DROP VIEW IF EXISTS vw_student_guardians");
  await db.execute("DROP VIEW IF EXISTS vw_student_information");
  await db.execute(`DROP VIEW IF EXISTS vw_${legacyBase}_guardians`);
  await db.execute(`DROP VIEW IF EXISTS vw_${legacyBase}_information`);

  await renameTableIfNeeded(legacyPlural, "students");
  await renameTableIfNeeded(legacyGuardiansTable, "student_guardians");
  await renameTableIfNeeded(legacyMotherTonguesTable, "student_mother_tongues");
  await renameTableIfNeeded(legacyIndigenousGroupsTable, "student_indigenous_groups");
  await renameTableIfNeeded(legacyReligionsTable, "student_religions");

  const relationTables = [
    "student_guardians",
    "student_mother_tongues",
    "student_indigenous_groups",
    "student_religions",
  ];

  for (const tableName of relationTables) {
    if (await hasTable(tableName)) {
      await dropForeignKeyIfExists(tableName, `fk_pg_${legacyBase}`);
      await dropForeignKeyIfExists(tableName, `fk_pmt_${legacyBase}`);
      await dropForeignKeyIfExists(tableName, `fk_pig_${legacyBase}`);
      await dropForeignKeyIfExists(tableName, `fk_pr_${legacyBase}`);

      if ((await hasColumn(tableName, legacyIdColumn)) && !(await hasColumn(tableName, "student_id"))) {
        await db.execute(
          `ALTER TABLE \`${tableName}\` CHANGE COLUMN \`${legacyIdColumn}\` student_id BIGINT UNSIGNED NOT NULL`,
        );
      }
    }
  }

  if (await hasTable("students")) {
    await dropIndexIfExists("students", `${legacyPlural}_lrn_unique`);
    await dropIndexIfExists("students", `idx_${legacyPlural}_deleted_at`);
  }

  if (await hasTable("student_guardians")) {
    await dropIndexIfExists("student_guardians", `idx_${legacyGuardiansTable}_deleted_at`);
    await dropIndexIfExists("student_guardians", `fk_pg_${legacyBase}`);

    if (!(await hasIndex("student_guardians", "idx_student_guardians_deleted_at"))) {
      await db.execute("ALTER TABLE student_guardians ADD INDEX idx_student_guardians_deleted_at (deleted_at)");
    }

    if (!(await hasIndex("student_guardians", "fk_pg_student"))) {
      await db.execute("ALTER TABLE student_guardians ADD INDEX fk_pg_student (student_id)");
    }

    if (!(await hasForeignKey("student_guardians", "fk_pg_student"))) {
      await db.execute(
        "ALTER TABLE student_guardians ADD CONSTRAINT fk_pg_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE",
      );
    }
  }

  if (await hasTable("student_mother_tongues")) {
    await dropIndexIfExists("student_mother_tongues", `${legacyMotherTonguesTable}_${legacyBase}_unique`);
    await dropIndexIfExists("student_mother_tongues", `idx_${legacyMotherTonguesTable}_deleted_at`);

    if (!(await hasIndex("student_mother_tongues", "student_mother_tongues_student_unique"))) {
      await db.execute("ALTER TABLE student_mother_tongues ADD UNIQUE KEY student_mother_tongues_student_unique (student_id)");
    }

    if (!(await hasIndex("student_mother_tongues", "idx_student_mother_tongues_deleted_at"))) {
      await db.execute("ALTER TABLE student_mother_tongues ADD INDEX idx_student_mother_tongues_deleted_at (deleted_at)");
    }

    if (!(await hasForeignKey("student_mother_tongues", "fk_pmt_student"))) {
      await db.execute(
        "ALTER TABLE student_mother_tongues ADD CONSTRAINT fk_pmt_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE",
      );
    }
  }

  if (await hasTable("student_indigenous_groups")) {
    await dropIndexIfExists("student_indigenous_groups", `${legacyIndigenousGroupsTable}_${legacyBase}_unique`);
    await dropIndexIfExists("student_indigenous_groups", `idx_${legacyIndigenousGroupsTable}_deleted_at`);

    if (!(await hasIndex("student_indigenous_groups", "student_indigenous_groups_student_unique"))) {
      await db.execute("ALTER TABLE student_indigenous_groups ADD UNIQUE KEY student_indigenous_groups_student_unique (student_id)");
    }

    if (!(await hasIndex("student_indigenous_groups", "idx_student_indigenous_groups_deleted_at"))) {
      await db.execute("ALTER TABLE student_indigenous_groups ADD INDEX idx_student_indigenous_groups_deleted_at (deleted_at)");
    }

    if (!(await hasForeignKey("student_indigenous_groups", "fk_pig_student"))) {
      await db.execute(
        "ALTER TABLE student_indigenous_groups ADD CONSTRAINT fk_pig_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE",
      );
    }
  }

  if (await hasTable("student_religions")) {
    await dropIndexIfExists("student_religions", `${legacyReligionsTable}_${legacyBase}_unique`);
    await dropIndexIfExists("student_religions", `idx_${legacyReligionsTable}_deleted_at`);

    if (!(await hasIndex("student_religions", "student_religions_student_unique"))) {
      await db.execute("ALTER TABLE student_religions ADD UNIQUE KEY student_religions_student_unique (student_id)");
    }

    if (!(await hasIndex("student_religions", "idx_student_religions_deleted_at"))) {
      await db.execute("ALTER TABLE student_religions ADD INDEX idx_student_religions_deleted_at (deleted_at)");
    }

    if (!(await hasForeignKey("student_religions", "fk_pr_student"))) {
      await db.execute(
        "ALTER TABLE student_religions ADD CONSTRAINT fk_pr_student FOREIGN KEY (student_id) REFERENCES students (id) ON UPDATE NO ACTION ON DELETE CASCADE",
      );
    }
  }
};

const hasPositionsColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM positions");
  return rows.some((row) => row.Field === columnName);
};

const hasUsersIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM users");
  return rows.some((row) => row.Key_name === indexName);
};

const hasPositionsIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM positions");
  return rows.some((row) => row.Key_name === indexName);
};

const hasSchoolsColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM schools");
  return rows.some((row) => row.Field === columnName);
};

const hasSchoolsIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM schools");
  return rows.some((row) => row.Key_name === indexName);
};

const hasStudentsColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM students");
  return rows.some((row) => row.Field === columnName);
};

const hasStudentsIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM students");
  return rows.some((row) => row.Key_name === indexName);
};

const hasGuardiansColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM guardians");
  return rows.some((row) => row.Field === columnName);
};

const hasGuardiansIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM guardians");
  return rows.some((row) => row.Key_name === indexName);
};

const ensureUsersTableShape = async (): Promise<void> => {
  for (const column of userColumnMigrations) {
    if (!(await hasUsersColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of userIndexMigrations) {
    if (!(await hasUsersIndex(index.name))) {
      await db.execute(index.sql);
    }
  }
};

const ensurePositionsTableShape = async (): Promise<void> => {
  for (const column of positionColumnMigrations) {
    if (!(await hasPositionsColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of positionIndexMigrations) {
    if (!(await hasPositionsIndex(index.name))) {
      await db.execute(index.sql);
    }
  }
};

const ensureSchoolsTableShape = async (): Promise<void> => {
  for (const column of schoolColumnMigrations) {
    if (!(await hasSchoolsColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of schoolIndexMigrations) {
    if (!(await hasSchoolsIndex(index.name))) {
      await db.execute(index.sql);
    }
  }
};

const ensureStudentsTableShape = async (): Promise<void> => {
  for (const column of studentColumnMigrations) {
    if (!(await hasStudentsColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of studentIndexMigrations) {
    if (!(await hasStudentsIndex(index.name))) {
      await db.execute(index.sql);
    }
  }
};

const ensureGuardiansTableShape = async (): Promise<void> => {
  for (const column of guardianColumnMigrations) {
    if (!(await hasGuardiansColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of guardianIndexMigrations) {
    if (!(await hasGuardiansIndex(index.name))) {
      await db.execute(index.sql);
    }
  }
};

const seedLookupTable = async (tableName: string, values: readonly string[]): Promise<void> => {
  const rows = values.map((value, index) => [value, index + 1]);

  await db.query(
    `
      INSERT INTO ${tableName} (name, sort_order)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        sort_order = VALUES(sort_order),
        is_active = 1,
        deleted_at = NULL
    `,
    [rows],
  );
};

const seedStudentInformationLookups = async (): Promise<void> => {
  await seedLookupTable("mother_tongues", motherTongueSeedValues);
  await seedLookupTable("indigenous_groups", indigenousGroupSeedValues);
  await seedLookupTable("religions", religionSeedValues);
};

const seedDefaultSchool = async (): Promise<void> => {
  await db.execute(
    `
      INSERT INTO schools (
        school_id,
        deped_school_id,
        school_name,
        district,
        division,
        region,
        address
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        school_id = school_id
    `,
    [
      1,
      "118768",
      "Trinidad 1 Central Elementary School",
      "Trinidad I",
      "Bohol",
      "Region VII - Central Visayas",
      "Poblacion, Trinidad, Bohol 6324, Philippines",
    ],
  );
};

export const initializeDatabase = async (): Promise<void> => {
  await ensureDatabaseExists();
  await migrateLegacyStudentTables();
  await db.execute(createUsersTableSql);
  await db.execute(createPositionsTableSql);
  await db.execute(createSchoolsTableSql);
  await db.execute(createStudentsTableSql);
  await db.execute(createGuardiansTableSql);
  await db.execute(createStudentGuardiansTableSql);
  await db.execute(createMotherTonguesTableSql);
  await db.execute(createIndigenousGroupsTableSql);
  await db.execute(createReligionsTableSql);
  await db.execute(createStudentMotherTonguesTableSql);
  await db.execute(createStudentIndigenousGroupsTableSql);
  await db.execute(createStudentReligionsTableSql);
  await ensureUsersTableShape();
  await ensurePositionsTableShape();
  await ensureSchoolsTableShape();
  await ensureStudentsTableShape();
  await ensureGuardiansTableShape();
  await seedDefaultSchool();
  await seedStudentInformationLookups();
  await db.execute(createStudentGuardiansViewSql);
  await db.execute(createStudentInformationViewSql);
  await verifyDatabaseConnection();
};
