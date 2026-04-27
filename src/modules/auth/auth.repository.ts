import type { ResultSetHeader } from "mysql2";

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

export const authRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE email = ? AND deleted_at IS NULL LIMIT 1`, [email]);
  },

  async findByEmailIncludingDeleted(email: string): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE email = ? LIMIT 1`, [email]);
  },

  async findById(userId: number): Promise<UserRecord | null> {
    return findOne(`${baseUserSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [userId]);
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
