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

const createPupilsTableSql = `
  CREATE TABLE IF NOT EXISTS pupils (
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
    UNIQUE KEY pupils_lrn_unique (lrn),
    KEY idx_pupils_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createGuardiansTableSql = `
  CREATE TABLE IF NOT EXISTS guardians (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100) NULL,
    lastname VARCHAR(100) NOT NULL,
    suffix VARCHAR(20) NULL,
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

const createPupilGuardiansTableSql = `
  CREATE TABLE IF NOT EXISTS pupil_guardians (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    pupil_id BIGINT UNSIGNED NOT NULL,
    guardian_id BIGINT UNSIGNED NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_primary TINYINT(1) NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_pupil_guardians_deleted_at (deleted_at),
    KEY fk_pg_pupil (pupil_id),
    KEY fk_pg_guardian (guardian_id),
    CONSTRAINT fk_pg_pupil FOREIGN KEY (pupil_id) REFERENCES pupils (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pg_guardian FOREIGN KEY (guardian_id) REFERENCES guardians (id) ON UPDATE NO ACTION ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createPupilGuardiansViewSql = `
  CREATE OR REPLACE VIEW vw_pupil_guardians AS
  SELECT
    pg.id,
    pg.pupil_id AS pupilId,
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
    p.lrn AS pupilLrn,
    p.first_name AS pupilFirstName,
    p.middle_name AS pupilMiddleName,
    p.last_name AS pupilLastName,
    p.suffix AS pupilSuffix
  FROM pupil_guardians pg
  INNER JOIN guardians g ON g.id = pg.guardian_id
  INNER JOIN pupils p ON p.id = pg.pupil_id
  WHERE pg.deleted_at IS NULL
    AND g.deleted_at IS NULL
    AND p.deleted_at IS NULL;
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

const pupilColumnMigrations = [
  { name: "lrn", sql: "ALTER TABLE pupils ADD COLUMN lrn VARCHAR(20) NOT NULL AFTER id" },
  { name: "first_name", sql: "ALTER TABLE pupils ADD COLUMN first_name VARCHAR(100) NOT NULL AFTER lrn" },
  { name: "middle_name", sql: "ALTER TABLE pupils ADD COLUMN middle_name VARCHAR(100) NULL DEFAULT NULL AFTER first_name" },
  { name: "last_name", sql: "ALTER TABLE pupils ADD COLUMN last_name VARCHAR(100) NOT NULL AFTER middle_name" },
  { name: "suffix", sql: "ALTER TABLE pupils ADD COLUMN suffix VARCHAR(20) NULL DEFAULT NULL AFTER last_name" },
  { name: "sex", sql: "ALTER TABLE pupils ADD COLUMN sex ENUM('male','female') NOT NULL AFTER suffix" },
  { name: "birthdate", sql: "ALTER TABLE pupils ADD COLUMN birthdate DATE NOT NULL AFTER sex" },
  { name: "birthplace", sql: "ALTER TABLE pupils ADD COLUMN birthplace VARCHAR(150) NULL DEFAULT NULL AFTER birthdate" },
  { name: "street_address", sql: "ALTER TABLE pupils ADD COLUMN street_address VARCHAR(255) NULL DEFAULT NULL AFTER birthplace" },
  { name: "barangay", sql: "ALTER TABLE pupils ADD COLUMN barangay VARCHAR(100) NOT NULL AFTER street_address" },
  { name: "city_municipality", sql: "ALTER TABLE pupils ADD COLUMN city_municipality VARCHAR(100) NOT NULL AFTER barangay" },
  { name: "province", sql: "ALTER TABLE pupils ADD COLUMN province VARCHAR(100) NOT NULL AFTER city_municipality" },
  { name: "region", sql: "ALTER TABLE pupils ADD COLUMN region VARCHAR(100) NOT NULL AFTER province" },
  { name: "status", sql: "ALTER TABLE pupils ADD COLUMN status ENUM('active','inactive','transferred','graduated') NULL DEFAULT 'active' AFTER region" },
  { name: "profile_picture", sql: "ALTER TABLE pupils ADD COLUMN profile_picture VARCHAR(255) NULL AFTER status" },
  { name: "deleted_at", sql: "ALTER TABLE pupils ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const pupilIndexMigrations = [
  { name: "pupils_lrn_unique", sql: "ALTER TABLE pupils ADD UNIQUE KEY pupils_lrn_unique (lrn)" },
  { name: "idx_pupils_deleted_at", sql: "ALTER TABLE pupils ADD INDEX idx_pupils_deleted_at (deleted_at)" },
] as const;

const guardianColumnMigrations = [
  { name: "firstname", sql: "ALTER TABLE guardians ADD COLUMN firstname VARCHAR(100) NOT NULL AFTER id" },
  { name: "middlename", sql: "ALTER TABLE guardians ADD COLUMN middlename VARCHAR(100) NULL AFTER firstname" },
  { name: "lastname", sql: "ALTER TABLE guardians ADD COLUMN lastname VARCHAR(100) NOT NULL AFTER middlename" },
  { name: "suffix", sql: "ALTER TABLE guardians ADD COLUMN suffix VARCHAR(20) NULL AFTER lastname" },
  {
    name: "contact_number",
    sql: "ALTER TABLE guardians ADD COLUMN contact_number VARCHAR(20) NOT NULL AFTER suffix",
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

interface ColumnRow extends RowDataPacket {
  Field: string;
}

interface IndexRow extends RowDataPacket {
  Key_name: string;
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

const hasPupilsColumn = async (columnName: string): Promise<boolean> => {
  const [rows] = await db.query<ColumnRow[]>("SHOW COLUMNS FROM pupils");
  return rows.some((row) => row.Field === columnName);
};

const hasPupilsIndex = async (indexName: string): Promise<boolean> => {
  const [rows] = await db.query<IndexRow[]>("SHOW INDEX FROM pupils");
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

const ensurePupilsTableShape = async (): Promise<void> => {
  for (const column of pupilColumnMigrations) {
    if (!(await hasPupilsColumn(column.name))) {
      await db.execute(column.sql);
    }
  }

  for (const index of pupilIndexMigrations) {
    if (!(await hasPupilsIndex(index.name))) {
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

export const initializeDatabase = async (): Promise<void> => {
  await ensureDatabaseExists();
  await db.execute(createUsersTableSql);
  await db.execute(createPositionsTableSql);
  await db.execute(createPupilsTableSql);
  await db.execute(createGuardiansTableSql);
  await db.execute(createPupilGuardiansTableSql);
  await ensureUsersTableShape();
  await ensurePositionsTableShape();
  await ensurePupilsTableShape();
  await ensureGuardiansTableShape();
  await db.execute(createPupilGuardiansViewSql);
  await verifyDatabaseConnection();
};
