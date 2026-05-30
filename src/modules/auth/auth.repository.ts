import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../../config/db";
import type { CreateUserInput, UserRecord, UserRow } from "../user/user.interface";

const baseUserSelect = `
  SELECT
    id,
    name,
    first_name AS firstName,
    middle_name AS middleName,
    last_name AS lastName,
    suffix,
    sex,
    email,
    contact_number AS contactNumber,
    address,
    barangay,
    municipality_city AS municipalityCity,
    province,
    region,
    username,
    password_hash AS passwordHash,
    roles,
    position,
    status,
    profile_picture AS profilePicture,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM users
`;

const parseRoles = (value: UserRow["roles"]): string[] => {
  if (!value) {
    return [];
  }

  const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const mapUser = (row: UserRow): UserRecord => {
  return {
    id: row.id,
    name: row.name,
    firstName: row.firstName,
    middleName: row.middleName,
    lastName: row.lastName,
    suffix: row.suffix,
    sex: row.sex,
    email: row.email,
    contactNumber: row.contactNumber,
    address: row.address,
    barangay: row.barangay,
    municipalityCity: row.municipalityCity,
    province: row.province,
    region: row.region,
    username: row.username,
    passwordHash: row.passwordHash,
    roles: parseRoles(row.roles),
    position: row.position,
    status: row.status,
    profilePicture: row.profilePicture,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

const findOne = async (query: string, values: unknown[]): Promise<UserRecord | null> => {
  const [rows] = await db.query<UserRow[]>(query, values);
  const user = rows[0];

  return user ? mapUser(user) : null;
};

interface PasswordRecoveryRequestRow extends RowDataPacket {
  id: number;
  userId: number;
  email: string;
  recoveryMethod: "temporary_password" | "otp_email";
  temporaryPasswordHash: string | null;
  otpCodeHash: string | null;
  expiresAt: Date | string;
  verifiedAt: Date | string | null;
  usedAt: Date | string | null;
  createdAt: Date | string;
  deletedAt: Date | string | null;
}

export const authRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE email = ? AND deleted_at IS NULL LIMIT 1`, [email]);
  },

  async findByUsername(username: string): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE username = ? AND deleted_at IS NULL LIMIT 1`, [username]);
  },

  async findByEmailIncludingDeleted(email: string): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE email = ? LIMIT 1`, [email]);
  },

  async findById(userId: number): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [userId]);
  },

  async createPasswordRecoveryRequest(
    userId: number,
    email: string,
    temporaryPasswordHash: string,
    expiresAt: Date,
  ): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO password_recovery_requests (
          user_id,
          email,
          recovery_method,
          temporary_password_hash,
          expires_at
        )
        VALUES (?, ?, 'temporary_password', ?, ?)
      `,
      [userId, email, temporaryPasswordHash, expiresAt],
    );

    return result.insertId;
  },

  async createOtpRecoveryRequest(
    userId: number,
    email: string,
    otpCodeHash: string,
    expiresAt: Date,
  ): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO password_recovery_requests (
          user_id,
          email,
          recovery_method,
          otp_code_hash,
          expires_at
        )
        VALUES (?, ?, 'otp_email', ?, ?)
      `,
      [userId, email, otpCodeHash, expiresAt],
    );

    return result.insertId;
  },

  async verifyOtpRecoveryRequest(recoveryRequestId: number, userId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE password_recovery_requests
        SET verified_at = CURRENT_TIMESTAMP,
            expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
        WHERE id = ?
          AND user_id = ?
          AND recovery_method = 'otp_email'
          AND used_at IS NULL
          AND deleted_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
      `,
      [recoveryRequestId, userId],
    );

    return result.affectedRows > 0;
  },

  async deleteActivePasswordRecoveryRequests(userId: number): Promise<void> {
    await db.execute(
      `
        UPDATE password_recovery_requests
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
          AND used_at IS NULL
          AND deleted_at IS NULL
      `,
      [userId],
    );
  },

  async findActivePasswordRecoveryRequest(userId: number): Promise<PasswordRecoveryRequestRow | null> {
    const [rows] = await db.query<PasswordRecoveryRequestRow[]>(
      `
        SELECT
          id,
          user_id AS userId,
          email,
          recovery_method AS recoveryMethod,
          temporary_password_hash AS temporaryPasswordHash,
          otp_code_hash AS otpCodeHash,
          expires_at AS expiresAt,
          verified_at AS verifiedAt,
          used_at AS usedAt,
          created_at AS createdAt,
          deleted_at AS deletedAt
        FROM password_recovery_requests
        WHERE user_id = ?
          AND recovery_method = 'temporary_password'
          AND used_at IS NULL
          AND deleted_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC, id DESC
        LIMIT 1
      `,
      [userId],
    );

    return rows[0] ?? null;
  },

  async findActivePasswordRecoveryRequestById(
    recoveryRequestId: number,
    userId: number,
  ): Promise<PasswordRecoveryRequestRow | null> {
    const [rows] = await db.query<PasswordRecoveryRequestRow[]>(
      `
        SELECT
          id,
          user_id AS userId,
          email,
          recovery_method AS recoveryMethod,
          temporary_password_hash AS temporaryPasswordHash,
          otp_code_hash AS otpCodeHash,
          expires_at AS expiresAt,
          verified_at AS verifiedAt,
          used_at AS usedAt,
          created_at AS createdAt,
          deleted_at AS deletedAt
        FROM password_recovery_requests
        WHERE id = ?
          AND user_id = ?
          AND used_at IS NULL
          AND deleted_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [recoveryRequestId, userId],
    );

    return rows[0] ?? null;
  },

  async findActiveOtpRecoveryRequestById(
    recoveryRequestId: number,
    email: string,
  ): Promise<PasswordRecoveryRequestRow | null> {
    const [rows] = await db.query<PasswordRecoveryRequestRow[]>(
      `
        SELECT
          id,
          user_id AS userId,
          email,
          recovery_method AS recoveryMethod,
          temporary_password_hash AS temporaryPasswordHash,
          otp_code_hash AS otpCodeHash,
          expires_at AS expiresAt,
          verified_at AS verifiedAt,
          used_at AS usedAt,
          created_at AS createdAt,
          deleted_at AS deletedAt
        FROM password_recovery_requests
        WHERE id = ?
          AND email = ?
          AND recovery_method = 'otp_email'
          AND used_at IS NULL
          AND deleted_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [recoveryRequestId, email],
    );

    return rows[0] ?? null;
  },

  async updatePasswordHash(userId: number, passwordHash: string): Promise<void> {
    await db.execute(
      `
        UPDATE users
        SET password_hash = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [passwordHash, userId],
    );
  },

  async completePasswordRecoveryRequest(recoveryRequestId: number, userId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE password_recovery_requests
        SET used_at = CURRENT_TIMESTAMP,
            deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND user_id = ?
          AND used_at IS NULL
          AND deleted_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
      `,
      [recoveryRequestId, userId],
    );

    return result.affectedRows > 0;
  },

  async createUser(payload: CreateUserInput): Promise<UserRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO users (
          name,
          first_name,
          middle_name,
          last_name,
          suffix,
          sex,
          email,
          contact_number,
          address,
          barangay,
          municipality_city,
          province,
          region,
          username,
          password_hash,
          roles,
          position,
          status,
          profile_picture
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.name,
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.suffix,
        payload.sex,
        payload.email,
        payload.contactNumber,
        payload.address,
        payload.barangay,
        payload.municipalityCity,
        payload.province,
        payload.region,
        payload.username,
        payload.passwordHash,
        JSON.stringify(payload.roles),
        payload.position,
        payload.status,
        payload.profilePicture,
      ],
    );

    const createdUser = await this.findById(result.insertId);

    if (!createdUser) {
      throw new Error("Failed to fetch created user.");
    }

    return createdUser;
  },
};
