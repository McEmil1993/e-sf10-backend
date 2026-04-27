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
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY pupils_lrn_unique (lrn),
    KEY idx_pupils_deleted_at (deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  { name: "deleted_at", sql: "ALTER TABLE pupils ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at" },
] as const;

const pupilIndexMigrations = [
  { name: "pupils_lrn_unique", sql: "ALTER TABLE pupils ADD UNIQUE KEY pupils_lrn_unique (lrn)" },
  { name: "idx_pupils_deleted_at", sql: "ALTER TABLE pupils ADD INDEX idx_pupils_deleted_at (deleted_at)" },
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

export const initializeDatabase = async (): Promise<void> => {
  await ensureDatabaseExists();
  await db.execute(createUsersTableSql);
  await db.execute(createPositionsTableSql);
  await db.execute(createPupilsTableSql);
  await ensureUsersTableShape();
  await ensurePositionsTableShape();
  await ensurePupilsTableShape();
  await verifyDatabaseConnection();
};
