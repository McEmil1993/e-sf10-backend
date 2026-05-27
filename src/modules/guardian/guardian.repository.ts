import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type {
  CreateGuardianInput,
  GuardianRecord,
  GuardianRow,
  UpdateGuardianInput,
} from "./guardian.interface";

const baseGuardianSelect = `
  SELECT
    id,
    firstname AS firstName,
    middlename AS middleName,
    lastname AS lastName,
    suffix,
    relationship,
    contact_number AS contactNumber,
    address,
    barangay,
    municipality_city AS municipalityCity,
    province,
    region,
    profile_picture AS profilePicture,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM guardians
`;

const mapGuardian = (row: GuardianRow): GuardianRecord => ({
  id: row.id,
  firstName: row.firstName,
  middleName: row.middleName,
  lastName: row.lastName,
  suffix: row.suffix,
  relationship: row.relationship,
  contactNumber: row.contactNumber,
  address: row.address,
  barangay: row.barangay,
  municipalityCity: row.municipalityCity,
  province: row.province,
  region: row.region,
  profilePicture: row.profilePicture,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

const findOne = async (query: string, values: unknown[]): Promise<GuardianRecord | null> => {
  const [rows] = await db.query<GuardianRow[]>(query, values);
  const guardian = rows[0];
  return guardian ? mapGuardian(guardian) : null;
};

export const guardianRepository = {
  async findAll(): Promise<GuardianRecord[]> {
    const [rows] = await db.query<GuardianRow[]>(`${baseGuardianSelect} WHERE deleted_at IS NULL ORDER BY id DESC`);
    return rows.map(mapGuardian);
  },

  async findById(guardianId: number): Promise<GuardianRecord | null> {
    return findOne(`${baseGuardianSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [guardianId]);
  },

  async createGuardian(payload: CreateGuardianInput): Promise<GuardianRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO guardians (
          firstname,
          middlename,
          lastname,
          suffix,
          relationship,
          contact_number,
          address,
          barangay,
          municipality_city,
          province,
          region,
          profile_picture
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.suffix,
        payload.relationship,
        payload.contactNumber,
        payload.address,
        payload.barangay,
        payload.municipalityCity,
        payload.province,
        payload.region,
        payload.profilePicture,
      ],
    );

    const createdGuardian = await this.findById(result.insertId);

    if (!createdGuardian) {
      throw new Error("Failed to fetch created guardian.");
    }

    return createdGuardian;
  },

  async updateGuardian(guardianId: number, payload: UpdateGuardianInput): Promise<GuardianRecord> {
    await db.execute(
      `
        UPDATE guardians
        SET
          firstname = ?,
          middlename = ?,
          lastname = ?,
          suffix = ?,
          relationship = ?,
          contact_number = ?,
          address = ?,
          barangay = ?,
          municipality_city = ?,
          province = ?,
          region = ?,
          profile_picture = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.suffix,
        payload.relationship,
        payload.contactNumber,
        payload.address,
        payload.barangay,
        payload.municipalityCity,
        payload.province,
        payload.region,
        payload.profilePicture,
        guardianId,
      ],
    );

    const updatedGuardian = await this.findById(guardianId);

    if (!updatedGuardian) {
      throw new Error("Failed to fetch updated guardian.");
    }

    return updatedGuardian;
  },

  async softDeleteGuardian(guardianId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE guardians
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [guardianId],
    );

    return result.affectedRows > 0;
  },
};
